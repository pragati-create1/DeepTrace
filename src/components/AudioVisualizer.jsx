import React, { useMemo } from 'react'

/**
 * Waveform-style visualization. When `seed` is provided it renders a
 * deterministic simulated waveform (demo mode); suspicious audio
 * segments are highlighted in red/orange.
 */
export default function AudioVisualizer({ duration = 15, segments = [], seed = 7, height = 90 }) {
  const bars = useMemo(() => {
    const n = 96
    let s = seed >>> 0 || 7
    const rand = () => {
      s |= 0; s = (s + 0x6d2b79f5) | 0
      let t = Math.imul(s ^ (s >>> 15), 1 | s)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
    return Array.from({ length: n }, (_, i) => {
      const t = (i / n) * duration
      const suspect = segments.some((g) => t >= g.start && t <= g.end)
      const base = 0.25 + Math.abs(Math.sin(i * 0.55)) * 0.45 + rand() * 0.3
      return { h: Math.min(1, base), suspect }
    })
  }, [duration, segments, seed])

  return (
    <div className="waveform" style={{ height }} role="img"
      aria-label={`Waveform visualization with ${segments.length} highlighted suspicious segment(s)`}>
      {bars.map((b, i) => (
        <div key={i} className={`wave-bar ${b.suspect ? 'suspect' : ''}`} style={{ height: `${b.h * 100}%` }} />
      ))}
    </div>
  )
}
