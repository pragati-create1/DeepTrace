import React from 'react'
import { Database } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { RiskBadge } from '../components/Feedback'
import { fmtDateShort, fmtBytes } from '../utils/helpers'

export default function Evidence() {
  const { evidence } = useApp()

  return (
    <div className="page">
      <header className="page-header">
        <h1>Evidence Repository</h1>
        <p>
          Cryptographic integrity register of all submitted media. Real files are hashed with
          SHA-256 in the browser; demo items carry a clearly-labeled <span className="tag-mono">DEMO HASH</span>.
        </p>
      </header>

      {evidence.length === 0 ? (
        <div className="card empty-state">
          <Database size={36} />
          <p>No evidence registered yet. Start an analysis to add evidence.</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Evidence ID</th><th>Filename</th><th>Type</th><th>Size</th>
                  <th>Hash (SHA-256)</th><th>Status</th><th>Risk</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {evidence.map((e) => (
                  <tr key={e.id} style={{ cursor: 'default' }}>
                    <td className="mono" style={{ color: 'var(--cyan)' }}>{e.id}</td>
                    <td>{e.filename}</td>
                    <td><span className="badge info">{e.kind.toUpperCase()}</span></td>
                    <td className="mono">{fmtBytes(e.size)}</td>
                    <td className="mono" style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis' }} title={e.hash}>
                      {e.hash.slice(0, 20)}…{' '}
                      {e.hashDemo && <span className="badge moderate" title="Demo placeholder — not a real cryptographic hash">DEMO HASH</span>}
                    </td>
                    <td><span className="badge complete">{e.status}</span></td>
                    <td><RiskBadge level={e.risk} /></td>
                    <td className="mono">{fmtDateShort(e.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
