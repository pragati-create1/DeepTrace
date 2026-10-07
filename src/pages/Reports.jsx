import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText } from 'lucide-react'
import ReportPreview from '../components/ReportPreview'
import { useApp } from '../store/AppContext'
import { RiskBadge } from '../components/Feedback'
import { fmtDateShort } from '../utils/helpers'

export default function Reports() {
  const { evidence } = useApp()
  const navigate = useNavigate()
  const analyzed = useMemo(() => evidence.filter((e) => e.result), [evidence])
  const [selectedId, setSelectedId] = useState(analyzed[0]?.id || null)
  const selected = analyzed.find((e) => e.id === selectedId) || analyzed[0]

  return (
    <div className="page">
      <header className="page-header no-print">
        <h1>Forensic Reports</h1>
        <p>Professional, printable authenticity assessments for analyzed evidence.</p>
      </header>

      {analyzed.length === 0 ? (
        <div className="card empty-state">
          <FileText size={36} />
          <p>No analyzed evidence yet. Run an analysis to generate a report.</p>
          <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={() => navigate('/analyze')}>
            Analyze Media
          </button>
        </div>
      ) : (
        <>
          <div className="card no-print" style={{ marginBottom: 22 }}>
            <div className="table-wrap">
              <table className="data">
                <thead><tr><th>Case</th><th>Evidence</th><th>Verdict</th><th>Risk</th><th>Date</th></tr></thead>
                <tbody>
                  {analyzed.map((e) => (
                    <tr key={e.id} onClick={() => setSelectedId(e.id)}
                      style={selected?.id === e.id ? { background: 'rgba(34,211,238,0.07)' } : undefined}>
                      <td className="mono" style={{ color: 'var(--cyan)' }}>{e.caseId}</td>
                      <td>{e.filename}</td>
                      <td>{e.result.classification}</td>
                      <td><RiskBadge level={e.risk} /></td>
                      <td className="mono">{fmtDateShort(e.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {selected && <ReportPreview evidence={selected} onNew={() => navigate('/analyze')} />}
        </>
      )}
    </div>
  )
}
