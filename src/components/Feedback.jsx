import React from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'

export function LoadingState({ label = 'Processing…' }) {
  return (
    <div className="loading-wrap" role="status" aria-live="polite">
      <Loader2 size={30} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
      <span>{label}</span>
    </div>
  )
}

export function ErrorMessage({ title = 'Something went wrong', message, onDismiss }) {
  if (!message) return null
  return (
    <div className="error-box" role="alert">
      <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <strong>{title}</strong>
        <div style={{ marginTop: 3, opacity: 0.9 }}>{message}</div>
      </div>
      {onDismiss && (
        <button className="btn btn-sm btn-ghost" onClick={onDismiss} aria-label="Dismiss error">Dismiss</button>
      )}
    </div>
  )
}

export function RiskBadge({ level }) {
  const l = (level || '').toLowerCase()
  const cls = l === 'low' ? 'low' : l === 'medium' ? 'medium' : l === 'high' ? 'high' : 'critical'
  return <span className={`badge ${cls}`}>{level || '—'}</span>
}

export function DemoRibbon() {
  return (
    <span className="demo-ribbon">
      <span className="dot amber" />
      DEMO MODE — Simulated forensic analysis
    </span>
  )
}
