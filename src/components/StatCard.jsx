import React from 'react'

const TINTS = {
  cyan: { bg: 'rgba(34,211,238,0.12)', border: 'rgba(34,211,238,0.35)', color: '#22d3ee' },
  green: { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.35)', color: '#34d399' },
  amber: { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.35)', color: '#fbbf24' },
  red: { bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.35)', color: '#f87171' },
  purple: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.35)', color: '#a78bfa' },
}

export default function StatCard({ icon: Icon, label, value, trend, tint = 'cyan' }) {
  const t = TINTS[tint] || TINTS.cyan
  return (
    <div className="card stat-card">
      <div className="stat-icon" style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.color }}>
        {Icon && <Icon size={22} />}
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {trend && <div className="stat-trend">{trend}</div>}
      </div>
    </div>
  )
}
