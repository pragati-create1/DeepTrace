import React from 'react'
import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react'

const ICONS = {
  normal: { Icon: CheckCircle2, color: '#34d399' },
  concern: { Icon: AlertTriangle, color: '#fbbf24' },
  suspicious: { Icon: AlertOctagon, color: '#f87171' },
}
const BADGE = { normal: 'normal', concern: 'concern', suspicious: 'suspicious' }

export default function EvidenceCard({ finding }) {
  const { Icon, color } = ICONS[finding.level] || ICONS.normal
  return (
    <div className="card evidence-card">
      <div className="evidence-head">
        <span className="evidence-title" style={{ color }}>
          <Icon size={16} /> {finding.title}
        </span>
        <span className={`badge ${BADGE[finding.level]}`}>{finding.status}</span>
      </div>
      <p className="evidence-text">{finding.text}</p>
      <span className="evidence-signal">SIGNAL: {finding.signal.toUpperCase()}</span>
    </div>
  )
}
