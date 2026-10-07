import React, { useState } from 'react'
import { ArrowDown, ChevronsDown, Layers } from 'lucide-react'

export default function CompressionPanel({ test }) {
  const [simulated, setSimulated] = useState(false)
  const [busy, setBusy] = useState(false)
  if (!test) return null

  const run = () => {
    setBusy(true)
    setTimeout(() => { setSimulated(true); setBusy(false) }, 1400)
  }

  const rows = [
    ['Visual', test.before.visual, test.after.visual],
    ['Audio', test.before.audio, test.after.audio],
    ['Temporal', test.before.temporal, test.after.temporal],
    ['Compression', test.before.compression, test.after.compression],
    ['Cross-Modal', test.before.crossModal, test.after.crossModal],
    ['Overall', test.before.overall, test.after.overall],
  ].filter(([, b]) => b != null)

  return (
    <section className="card" aria-label="Compression Robustness Test">
      <div className="flex-between">
        <div>
          <h3 className="card-title"><Layers size={18} color="#3b82f6" /> Compression Robustness Test</h3>
          <p className="card-sub" style={{ marginBottom: 0 }}>
            Robust forensic signals should remain partially observable even after common
            compression or re-encoding.
          </p>
        </div>
        <div className="flex-between" style={{ gap: 10 }}>
          <button className="btn" onClick={run} disabled={busy}>
            {busy ? <span className="spinner" /> : <ChevronsDown size={16} />}
            {busy ? 'Re-encoding…' : 'Simulate Compression'}
          </button>
          <button className="btn btn-ghost" onClick={() => setSimulated((s) => s)} disabled={!simulated}>
            Compare Results
          </button>
        </div>
      </div>

      <div className="flow" style={{ margin: '20px 0' }}>
        <div className="flow-node accent">ORIGINAL</div>
        <ArrowDown className="flow-arrow" size={18} />
        <div className="flow-node">COMPRESSION</div>
        <ArrowDown className="flow-arrow" size={18} />
        <div className="flow-node">RE-ENCODING</div>
        <ArrowDown className="flow-arrow" size={18} />
        <div className="flow-node purple">RE-ANALYSIS</div>
      </div>

      {simulated && (
        <>
          <div className="flex-between" style={{ marginBottom: 12 }}>
            <span className="signal-name">Signal Stability</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 750, color: test.stability >= 70 ? '#34d399' : '#fbbf24' }}>
              {test.stability}%
            </span>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr><th>Signal</th><th>Before</th><th>After Re-encoding</th><th>Δ</th></tr>
              </thead>
              <tbody>
                {rows.map(([name, b, a]) => (
                  <tr key={name} style={{ cursor: 'default', fontWeight: name === 'Overall' ? 700 : 400 }}>
                    <td>{name}</td>
                    <td className="mono">{b}%</td>
                    <td className="mono">{a}%</td>
                    <td className="mono" style={{ color: b - a > 12 ? '#f87171' : '#34d399' }}>−{b - a}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}
