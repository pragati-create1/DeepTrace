// Formatting + hashing helpers

export const fmtBytes = (n) => {
  if (n == null || isNaN(n)) return '—'
  if (n < 1024) return `${n} B`
  const units = ['KB', 'MB', 'GB']
  let v = n / 1024, i = 0
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++ }
  return `${v.toFixed(v >= 100 ? 0 : 1)} ${units[i]}`
}

export const fmtDate = (d) => {
  const dt = d ? new Date(d) : new Date()
  return dt.toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export const fmtDateShort = (d) => {
  const dt = d ? new Date(d) : new Date()
  return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

/** Real SHA-256 of actual file bytes (Web Crypto). */
export async function sha256Hex(file) {
  const buf = await file.arrayBuffer()
  const digest = await crypto.subtle.digest('SHA-256', buf)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Clearly-labeled pseudo hash for virtual demo media (NOT cryptographic). */
export function demoHash(seed) {
  let h = 2166136261 >>> 0
  let out = ''
  for (let i = 0; i < 64; i++) {
    h ^= seed.charCodeAt(i % seed.length)
    h = Math.imul(h, 16777619)
    out += (h & 0xff).toString(16).padStart(2, '0')
    h = Math.imul(h ^ (h >>> 13), 0x5bd1e995)
  }
  return out.slice(0, 64)
}

export const uid = (prefix = 'EV') =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
