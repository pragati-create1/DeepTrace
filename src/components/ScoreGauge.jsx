import React, { useEffect, useState } from 'react'

const VERDICT_COLOR = {
  'LIKELY AUTHENTIC': '#34d399',
  'REVIEW RECOMMENDED': '#fbbf24',
  'SUSPICIOUS': '#fb923c',
  'LIKELY MANIPULATED': '#f87171',
}

export default function ScoreGauge({ score = 0, classification = '', size = 210 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const from = display
    const dur = 900
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur)
      setDisplay(Math.round(from + (score - from) * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score])

  const r = 84
  const c = 2 * Math.PI * r
  const color = VERDICT_COLOR[classification] || '#22d3ee'
  const offset = c - (display / 100) * c

  return (
    <div className="gauge-wrap">
      <svg className="gauge-svg" width={size} height={size} viewBox="0 0 210 210" role="img"
        aria-label={`Authenticity score ${score} percent, ${classification}`}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#22d3ee" />
            <stop offset="0.55" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle cx="105" cy="105" r={r} fill="none" stroke="rgba(125,166,255,0.12)" strokeWidth="13" />
        <circle
          cx="105" cy="105" r={r} fill="none"
          stroke={score >= 60 ? 'url(#gaugeGrad)' : color}
          strokeWidth="13" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          transform="rotate(-90 105 105)"
          style={{ transition: 'stroke-dashoffset 0.3s ease', filter: `drop-shadow(0 0 8px ${color}66)` }}
        />
        <text x="105" y="100" textAnchor="middle" fill="#e8eefc" fontSize="42" fontWeight="800">{display}%</text>
        <text x="105" y="126" textAnchor="middle" fill="#61739a" fontSize="8.5" letterSpacing="2.5">AUTHENTICITY SCORE</text>
      </svg>
      <div className="gauge-verdict">
        <span className="badge" style={{ color, borderColor: `${color}66`, background: `${color}14`, fontSize: '0.78rem', padding: '6px 16px' }}>
          {classification}
        </span>
      </div>
    </div>
  )
}
