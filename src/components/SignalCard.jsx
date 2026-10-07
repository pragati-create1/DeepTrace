import React from 'react'

const scoreColor = (v) => (v >= 75 ? '#34d399' : v >= 55 ? '#fbbf24' : v >= 40 ? '#fb923c' : '#f87171')

export default function SignalCard({ icon: Icon, name, value }) {
  const na = value == null
  return (
    <div className="card signal-card">
      <div className="signal-head">
        <span className="signal-name">{Icon && <Icon size={15} color="#22d3ee" />} {name}</span>
      </div>
      {na ? (
        <div className="signal-na">N/A — modality not present</div>
      ) : (
        <>
          <div className="signal-score" style={{ color: scoreColor(value) }}>{value}%</div>
          <div className="progress-bar" style={{ marginTop: 10 }}>
            <div className="progress-fill" style={{
              width: `${value}%`,
              background: `linear-gradient(90deg, ${scoreColor(value)}aa, ${scoreColor(value)})`,
              boxShadow: `0 0 10px ${scoreColor(value)}66`,
            }} />
          </div>
        </>
      )}
    </div>
  )
}
