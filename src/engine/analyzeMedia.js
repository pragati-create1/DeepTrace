// ============================================================
// DeepTrace DEMO ANALYSIS ENGINE
// ------------------------------------------------------------
// IMPORTANT: This module produces SIMULATED forensic analysis.
// Scores are deterministic per file (seeded by file fingerprint)
// so the same file yields similar results, but they are NOT
// produced by a real machine-learning model.
//
// A real ML backend (e.g. FastAPI + CV/audio models) can replace
// this module later — the return contract below is the seam.
// ============================================================

const clamp = (v, min = 0, max = 100) => Math.min(max, Math.max(min, Math.round(v)))

// --- Deterministic PRNG (mulberry32) seeded from a string ---
function seedFromString(str) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Quick fingerprint: name + size + type + hash of first 64KB
async function fileFingerprint(file) {
  try {
    const slice = file.slice(0, 65536)
    const buf = await slice.arrayBuffer()
    const digest = await crypto.subtle.digest('SHA-256', buf)
    const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
    return `${file.name}|${file.size}|${file.type}|${hex}`
  } catch {
    return `${file.name}|${file.size}|${file.type}`
  }
}

export function mediaKindFromType(type = '') {
  if (type.startsWith('image/')) return 'image'
  if (type.startsWith('video/')) return 'video'
  if (type.startsWith('audio/')) return 'audio'
  return 'unknown'
}

const SIGNAL_WEIGHTS = { visual: 0.3, audio: 0.2, temporal: 0.2, compression: 0.15, crossModal: 0.15 }

function availableSignals(kind, hasAudio) {
  if (kind === 'image') return ['visual', 'compression']
  if (kind === 'audio') return ['audio', 'temporal', 'compression']
  if (kind === 'video') return hasAudio === false
    ? ['visual', 'temporal', 'compression']
    : ['visual', 'audio', 'temporal', 'compression', 'crossModal']
  return ['visual', 'compression']
}

function classify(score) {
  if (score >= 80) return { classification: 'LIKELY AUTHENTIC', risk: 'LOW', tone: 'authentic' }
  if (score >= 60) return { classification: 'REVIEW RECOMMENDED', risk: 'MEDIUM', tone: 'review' }
  if (score >= 40) return { classification: 'SUSPICIOUS', risk: 'HIGH', tone: 'suspicious' }
  return { classification: 'LIKELY MANIPULATED', risk: 'CRITICAL', tone: 'manipulated' }
}

// --- Findings library (tiered by signal score) ---
const FINDINGS = {
  visual: [
    { key: 'facial-texture', title: 'Facial Texture', tiers: [
      'Texture patterns remain relatively consistent across analyzed facial regions.',
      'Some texture irregularities were observed across analyzed facial regions.',
      'Pronounced texture inconsistencies detected across analyzed facial regions.'] },
    { key: 'lighting', title: 'Lighting Consistency', tiers: [
      'Illumination direction and intensity appear coherent across the scene.',
      'Minor illumination differences were detected around the analyzed face.',
      'Lighting direction on the subject conflicts with the surrounding scene.'] },
    { key: 'edge-artifacts', title: 'Edge & Boundary Artifacts', tiers: [
      'No abnormal blending boundaries detected around facial contours.',
      'Subtle blending irregularities detected near facial boundaries.',
      'Strong boundary artifacts suggest possible face-region compositing.'] },
  ],
  audio: [
    { key: 'spectral', title: 'Audio Spectral Pattern', tiers: [
      'Spectral characteristics are consistent with natural speech patterns.',
      'Some spectral characteristics differ from expected natural speech patterns.',
      'Spectral envelope shows strong synthetic-voice characteristics.'] },
    { key: 'prosody', title: 'Prosody & Cadence', tiers: [
      'Speech rhythm and intonation appear natural and continuous.',
      'Occasional unnatural cadence detected in speech segments.',
      'Speech cadence is highly uniform, suggesting possible synthesis.'] },
  ],
  temporal: [
    { key: 'temporal-consistency', title: 'Temporal Consistency', tiers: [
      'Frame-to-frame facial movement appears consistent.',
      'Minor frame-to-frame jitter detected in facial landmarks.',
      'Abrupt frame-to-frame discontinuities detected in facial regions.'] },
    { key: 'blink-dynamics', title: 'Blink & Micro-Movement', tiers: [
      'Blink frequency and micro-movements fall within natural ranges.',
      'Blink patterns show mild irregularity across the sequence.',
      'Blink dynamics deviate strongly from natural human patterns.'] },
  ],
  compression: [
    { key: 'compression-artifacts', title: 'Compression Artifacts', tiers: [
      'Compression characteristics are uniform across the media.',
      'Localized compression characteristics differ from surrounding regions.',
      'Strong double-compression signatures indicate possible re-encoding after editing.'] },
    { key: 'noise-floor', title: 'Sensor Noise Floor', tiers: [
      'Noise floor is consistent with a single acquisition source.',
      'Noise floor varies slightly between regions.',
      'Noise floor inconsistencies suggest mixed-source compositing.'] },
  ],
  crossModal: [
    { key: 'lip-sync', title: 'Lip-Sync', tiers: [
      'Audio timing and visible mouth movement appear aligned.',
      'Audio timing and visible mouth movement show possible temporal inconsistencies.',
      'Audio and visible mouth movement are frequently misaligned.'] },
    { key: 'av-coherence', title: 'Audio-Visual Coherence', tiers: [
      'Independent audio and visual signals agree with each other.',
      'Partial disagreement between audio and visual signals.',
      'Audio and visual signals conflict across multiple segments.'] },
  ],
}

function tierIndex(score) { return score >= 75 ? 0 : score >= 55 ? 1 : 2 }
const TIER_STATUS = [
  { label: 'Normal', level: 'normal' },
  { label: 'Moderate Concern', level: 'concern' },
  { label: 'Suspicious', level: 'suspicious' },
]

const fmtTime = (s) => {
  const m = Math.floor(s / 60)
  const sec = (s % 60).toFixed(1).padStart(4, '0')
  return `${String(m).padStart(2, '0')}:${sec}`
}

/**
 * analyzeMedia — DEMO / SIMULATED ANALYSIS
 * @param {object} input { file?: File, demo?: {seed, profile}, kind, duration?, width?, height?, hasAudio? }
 * @returns {Promise<AnalysisResult>}
 */
export async function analyzeMedia(input) {
  const { file = null, demo = null, kind, duration = null, hasAudio } = input

  const fingerprint = demo
    ? `DEMO|${demo.seed}`
    : await fileFingerprint(file)

  const rng = mulberry32(seedFromString(fingerprint))
  const profile = demo?.profile || {}
  const base = profile.base ?? (34 + rng() * 58) // unknown files spread across range
  const jitter = (amt = 11) => (rng() - 0.5) * 2 * amt

  const signals = {}
  const avail = availableSignals(kind, hasAudio)
  for (const s of avail) {
    const bias = profile.biases?.[s] ?? 0
    signals[s] = clamp(base + bias + jitter())
  }

  // Weighted fusion over available signals
  let wSum = 0, acc = 0
  for (const s of avail) { wSum += SIGNAL_WEIGHTS[s]; acc += signals[s] * SIGNAL_WEIGHTS[s] }
  const authenticityScore = clamp(acc / wSum + jitter(3))

  const { classification, risk, tone } = classify(authenticityScore)

  // Confidence: more signals + agreement => higher confidence
  const vals = avail.map((s) => signals[s])
  const spread = Math.max(...vals) - Math.min(...vals)
  const confidence = clamp(58 + avail.length * 6 - spread * 0.35 + rng() * 8, 55, 97)

  // Findings (dynamic, driven by signal scores)
  const findings = []
  for (const s of avail) {
    for (const f of FINDINGS[s]) {
      const ti = tierIndex(signals[s])
      findings.push({
        key: f.key, title: f.title, signal: s,
        status: TIER_STATUS[ti].label, level: TIER_STATUS[ti].level,
        text: f.tiers[ti],
      })
    }
  }
  findings.sort((a, b) => ({ suspicious: 0, concern: 1, normal: 2 }[a.level] - { suspicious: 0, concern: 1, normal: 2 }[b.level]))

  // Suspicious regions (image/video) — percentage coordinates
  const suspiciousRegions = []
  if (kind === 'image' || kind === 'video') {
    const n = tone === 'authentic' ? 1 : 2 + Math.floor(rng() * 3)
    for (let i = 0; i < n; i++) {
      suspiciousRegions.push({
        id: `R${i + 1}`,
        x: 18 + rng() * 45, y: 12 + rng() * 40,
        w: 16 + rng() * 20, h: 16 + rng() * 22,
        severity: rng() > 0.45 ? 'high' : 'moderate',
        label: `REGION ${i + 1} · ${rng() > 0.45 ? 'TEXTURE ANOMALY' : 'COMPRESSION DELTA'}`,
      })
    }
  }

  // Suspicious frames (video)
  const dur = duration || demo?.duration || 15
  const suspiciousFrames = []
  if (kind === 'video') {
    const fps = 25
    const picks = [0.18, 0.47, 0.79].map((p) => p + jitter(0.05))
    picks.forEach((p, i) => {
      const t = Math.min(dur - 0.1, Math.max(0.1, p * dur))
      suspiciousFrames.push({
        frame: Math.round(t * fps),
        time: fmtTime(t),
        note: ['Landmark discontinuity', 'Texture flicker', 'Blending boundary shift'][i],
      })
    })
  }

  // Suspicious audio segments (audio/video)
  const audioSegments = []
  if (kind === 'audio' || (kind === 'video' && hasAudio !== false)) {
    const n = tone === 'authentic' ? 1 : 2 + Math.floor(rng() * 2)
    for (let i = 0; i < n; i++) {
      const start = rng() * Math.max(2, dur - 4)
      audioSegments.push({
        start, end: Math.min(dur, start + 1.2 + rng() * 2.4),
        startLabel: fmtTime(start), endLabel: fmtTime(Math.min(dur, start + 2.5)),
        note: rng() > 0.5 ? 'Spectral anomaly' : 'Unnatural cadence',
      })
    }
  }

  // Cross-modal (video with audio)
  let lipSyncScore = null
  let lipSyncEvents = []
  if (kind === 'video' && hasAudio !== false) {
    lipSyncScore = clamp((signals.crossModal ?? base) + jitter(8))
    const picks = [0.28, 0.58, 0.87]
    lipSyncEvents = picks.map((p, i) => {
      const t = Math.min(dur - 0.1, Math.max(0.2, (p + jitter(0.04)) * dur))
      const consistent = lipSyncScore >= 70 ? true : rng() > 0.55
      return { time: fmtTime(t), seconds: t, consistent, note: consistent ? 'Consistent' : 'Possible mismatch' }
    })
  }

  // Compression robustness (precomputed simulation)
  const after = {}
  for (const s of avail) after[s] = clamp(signals[s] - (5 + rng() * 13))
  let aW = 0, aAcc = 0
  for (const s of avail) { aW += SIGNAL_WEIGHTS[s]; aAcc += after[s] * SIGNAL_WEIGHTS[s] }
  const afterScore = clamp(aAcc / aW)
  const compressionTest = {
    before: { ...signals, overall: authenticityScore },
    after: { ...after, overall: afterScore },
    stability: clamp(100 - (authenticityScore - afterScore) * 2.6, 40, 98),
  }

  return {
    demoMode: true,
    fingerprint: fingerprint.slice(0, 24),
    kind, duration: dur,
    authenticityScore, confidence, risk, classification, tone,
    visualScore: signals.visual ?? null,
    audioScore: signals.audio ?? null,
    temporalScore: signals.temporal ?? null,
    compressionScore: signals.compression ?? null,
    crossModalScore: signals.crossModal ?? null,
    signals,
    findings,
    suspiciousFrames, suspiciousRegions, audioSegments,
    lipSyncScore, lipSyncEvents,
    compressionTest,
    disclaimer: 'DEMO / SIMULATED ANALYSIS — scores are generated by a deterministic heuristic for demonstration, not by a validated AI model.',
  }
}
