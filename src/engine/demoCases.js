// Built-in demo cases — virtual media (no real files needed).
// Each case carries a tuned profile so results are deterministic and distinct.

function demoSvg(hueA, hueB, label) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='960' height='540'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='hsl(${hueA},70%,16%)'/>
      <stop offset='1' stop-color='hsl(${hueB},75%,30%)'/>
    </linearGradient>
  </defs>
  <rect width='960' height='540' fill='url(#g)'/>
  <g stroke='hsla(${hueA},90%,70%,0.25)' fill='none'>
    ${Array.from({ length: 12 }, (_, i) => `<circle cx='${120 + i * 70}' cy='${270 + Math.sin(i) * 90}' r='${26 + (i % 3) * 14}'/>`).join('')}
  </g>
  <g stroke='hsla(${hueB},95%,75%,0.5)' stroke-width='2' fill='none'>
    <path d='M0 420 ${Array.from({ length: 24 }, (_, i) => `L ${i * 40} ${420 + Math.sin(i * 1.7) * 55}`).join(' ')}'/>
  </g>
  <ellipse cx='480' cy='250' rx='90' ry='120' fill='hsla(${hueA},40%,72%,0.75)'/>
  <ellipse cx='450' cy='230' rx='12' ry='9' fill='hsl(${hueB},60%,18%)'/>
  <ellipse cx='510' cy='230' rx='12' ry='9' fill='hsl(${hueB},60%,18%)'/>
  <path d='M445 305 q35 26 70 0' stroke='hsl(${hueB},60%,18%)' stroke-width='7' fill='none' stroke-linecap='round'/>
  <text x='30' y='505' font-family='monospace' font-size='24' fill='hsla(${hueB},90%,80%,0.85)'>${label} — DEMO EVIDENCE</text>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const DEMO_CASES = [
  {
    id: 'CASE-001',
    name: 'Authentic Interview',
    kind: 'video',
    fileName: 'interview_segment_A.mp4',
    mime: 'video/mp4',
    size: 24_800_000,
    duration: 18,
    seed: 'case-001-authentic-interview',
    profile: { base: 87, biases: { visual: 4, audio: 2, temporal: 5, compression: 0, crossModal: 3 } },
    expected: 'Likely Authentic',
    poster: demoSvg(200, 250, 'CASE-001'),
    description: 'Interview footage with consistent texture, lighting, temporal and cross-modal signals.',
  },
  {
    id: 'CASE-002',
    name: 'Face Manipulation Example',
    kind: 'image',
    fileName: 'portrait_suspect_B.jpg',
    mime: 'image/jpeg',
    size: 3_400_000,
    duration: null,
    seed: 'case-002-face-manipulation',
    profile: { base: 38, biases: { visual: -10, compression: -14 } },
    expected: 'Suspicious / Likely Manipulated',
    poster: demoSvg(280, 320, 'CASE-002'),
    description: 'Portrait with conflicting facial texture and localized compression anomalies.',
  },
  {
    id: 'CASE-003',
    name: 'Audio-Video Sync Test',
    kind: 'video',
    fileName: 'statement_clip_C.mp4',
    mime: 'video/mp4',
    size: 31_200_000,
    duration: 15,
    seed: 'case-003-av-sync',
    profile: { base: 64, biases: { crossModal: -26, audio: -6, visual: 8, temporal: 2 } },
    expected: 'Cross-Modal Inconsistency',
    poster: demoSvg(160, 210, 'CASE-003'),
    description: 'Statement clip where speech timing and visible mouth movement disagree.',
  },
]
