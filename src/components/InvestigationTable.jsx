import React from 'react'
import { RiskBadge } from './Feedback'
import { fmtDateShort } from '../utils/helpers'

const AUTH_BADGE = {
  'LIKELY AUTHENTIC': 'authentic',
  'REVIEW RECOMMENDED': 'review',
  'SUSPICIOUS': 'suspicious',
  'LIKELY MANIPULATED': 'manipulated',
}

export default function InvestigationTable({ rows, onSelect }) {
  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr>
            <th>Case ID</th><th>Evidence</th><th>Media Type</th>
            <th>Authenticity</th><th>Risk</th><th>Date</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} onClick={() => onSelect?.(r)} tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelect?.(r)}>
              <td className="mono" style={{ color: 'var(--cyan)' }}>{r.caseId}</td>
              <td>{r.evidence}</td>
              <td><span className="badge info">{r.mediaType}</span></td>
              <td><span className={`badge ${AUTH_BADGE[r.authenticity] || 'review'}`}>{r.authenticity}</span></td>
              <td><RiskBadge level={r.risk} /></td>
              <td className="mono">{fmtDateShort(r.date)}</td>
              <td><span className={`badge ${r.status === 'Complete' ? 'complete' : 'processing'}`}>{r.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
