import React from 'react'
import { GitCompareArrows } from 'lucide-react'
import Timeline from './Timeline'

export default function CrossModalPanel({ lipSyncScore, events = [], duration = 15 }) {
  if (lipSyncScore == null) return null
  const color = lipSyncScore >= 70 ? '#34d399' : lipSyncScore >= 55 ? '#fbbf24' : '#f87171'

  return (
    <section className="card" aria-label="Cross-Modal Consistency">
      <h3 className="card-title"><GitCompareArrows size={18} color="#8b5cf6" /> Cross-Modal Consistency</h3>
      <p className="card-sub">
        Cross-modal analysis checks whether independent media signals agree with each other —
        here, video facial movement is compared against audio speech timing.
      </p>

      <div className="grid cols-2" style={{ marginBottom: 16 }}>
        <div className="flow-node accent" style={{ minWidth: 0 }}>VIDEO · FACIAL MOVEMENT</div>
        <div className="flow-node purple" style={{ minWidth: 0 }}>AUDIO · SPEECH TIMING</div>
      </div>

      <div className="flex-between" style={{ marginBottom: 12 }}>
        <span className="signal-name">Lip-Sync Consistency</span>
        <span style={{ fontSize: '1.5rem', fontWeight: 750, color }}>{lipSyncScore}%</span>
      </div>
      <div className="progress-bar" style={{ marginBottom: 18 }}>
        <div className="progress-fill" style={{ width: `${lipSyncScore}%`, background: color, boxShadow: `0 0 10px ${color}66` }} />
      </div>

      <Timeline duration={duration} markers={events.map((e) => ({
        at: e.seconds, label: e.time, tone: e.consistent ? 'ok' : 'warn',
      }))} />
      <div className="event-list">
        {events.map((e, i) => (
          <div key={i} className="event-row">
            <span className="event-dot" style={{ background: e.consistent ? '#34d399' : '#fbbf24' }} />
            <span className="event-time">{e.time}</span>
            <span>{e.note}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
