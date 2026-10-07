import React, { useState } from 'react'
import { FolderOpen, Plus, ChevronLeft } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { ErrorMessage } from '../components/Feedback'
import { fmtDate } from '../utils/helpers'

export default function Investigations() {
  const { investigations, addInvestigation } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ id: '', name: '', investigator: '', description: '' })
  const [error, setError] = useState(null)

  const submit = (e) => {
    e.preventDefault()
    setError(null)
    if (!form.id.trim()) return setError('Case ID is required.')
    if (!form.name.trim()) return setError('Case name is required.')
    if (investigations.some((c) => c.id === form.id.trim())) return setError(`Case ID "${form.id}" already exists.`)
    const now = new Date().toISOString()
    addInvestigation({
      id: form.id.trim(), name: form.name.trim(),
      investigator: form.investigator.trim() || 'Unassigned',
      description: form.description.trim() || '—',
      createdAt: now, status: 'Open',
      timeline: [{ time: now, label: 'Investigation Created', desc: `Case ${form.id.trim()} opened` }],
    })
    setForm({ id: '', name: '', investigator: '', description: '' })
    setShowForm(false)
  }

  if (selected) {
    const c = investigations.find((x) => x.id === selected)
    return (
      <div className="page">
        <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)} style={{ marginBottom: 18 }}>
          <ChevronLeft size={15} /> All Investigations
        </button>
        <header className="page-header">
          <div className="flex-between">
            <div>
              <h1>{c.name}</h1>
              <p>{c.description}</p>
            </div>
            <span className={`badge ${c.status === 'Complete' ? 'complete' : 'processing'}`}>{c.status}</span>
          </div>
        </header>
        <div className="grid cols-2">
          <div className="card">
            <h3 className="card-title">Case Details</h3>
            <table className="meta-table" style={{ marginTop: 10 }}>
              <tbody>
                <tr><td>Case ID</td><td>{c.id}</td></tr>
                <tr><td>Investigator</td><td>{c.investigator}</td></tr>
                <tr><td>Created</td><td>{fmtDate(c.createdAt)}</td></tr>
                <tr><td>Status</td><td>{c.status}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="card">
            <h3 className="card-title">Investigation Timeline</h3>
            <div className="case-timeline" style={{ marginTop: 16 }}>
              {[...c.timeline].sort((a, b) => new Date(a.time) - new Date(b.time)).map((ev, i) => (
                <div className="case-event" key={i}>
                  <div className="ce-time">{fmtDate(ev.time)}</div>
                  <div className="ce-label">{ev.label}</div>
                  <div className="ce-desc">{ev.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page-header">
        <div className="flex-between">
          <div>
            <h1>Investigations</h1>
            <p>Forensic case management — track evidence, analysis and assessments.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
            <Plus size={16} /> Create Case
          </button>
        </div>
      </header>

      {error && <div style={{ marginBottom: 18 }}><ErrorMessage title="Invalid case information" message={error} onDismiss={() => setError(null)} /></div>}

      {showForm && (
        <form className="card" onSubmit={submit} style={{ marginBottom: 22 }}>
          <h3 className="card-title">New Investigation</h3>
          <div className="grid cols-2" style={{ marginTop: 14 }}>
            <div className="field">
              <label htmlFor="f-id">Case ID *</label>
              <input id="f-id" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="CASE-004" />
            </div>
            <div className="field">
              <label htmlFor="f-name">Case Name *</label>
              <input id="f-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Election clip verification" />
            </div>
            <div className="field">
              <label htmlFor="f-inv">Investigator</label>
              <input id="f-inv" value={form.investigator} onChange={(e) => setForm({ ...form, investigator: e.target.value })} placeholder="Name / badge" />
            </div>
            <div className="field">
              <label htmlFor="f-desc">Description</label>
              <textarea id="f-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Context, source of media, suspicion…" />
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-primary">Create Investigation</button>
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="grid cols-3">
        {investigations.map((c) => (
          <div className="card" key={c.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(c.id)}
            role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setSelected(c.id)}>
            <div className="flex-between" style={{ marginBottom: 10 }}>
              <span className="mono" style={{ color: 'var(--cyan)' }}><FolderOpen size={14} style={{ verticalAlign: -2 }} /> {c.id}</span>
              <span className={`badge ${c.status === 'Complete' ? 'complete' : 'processing'}`}>{c.status}</span>
            </div>
            <h4 style={{ margin: '0 0 6px' }}>{c.name}</h4>
            <p style={{ margin: '0 0 10px', color: 'var(--text-2)', fontSize: '0.83rem' }}>{c.description}</p>
            <div className="mono" style={{ color: 'var(--text-3)', fontSize: '0.72rem' }}>
              {c.investigator} · {fmtDate(c.createdAt)} · {c.timeline.length} events
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
