import React from 'react'

/** Simple horizontal timeline with event markers. `markers`: [{at(seconds), label, tone}] */
export default function Timeline({ duration = 15, markers = [] }) {
  return (
    <div className="timeline-track" role="img" aria-label="Event timeline">
      {markers.map((m, i) => {
        const left = Math.min(97, Math.max(1, (m.at / duration) * 100))
        return (
          <div key={i} className={`timeline-marker ${m.tone === 'ok' ? 'ok' : m.tone === 'warn' ? '' : 'bad'}`} style={{ left: `${left}%` }}>
            <span>{m.label}</span>
          </div>
        )
      })}
    </div>
  )
}
