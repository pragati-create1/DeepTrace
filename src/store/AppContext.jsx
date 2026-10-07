import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DEMO_CASES } from '../engine/demoCases'
import { demoHash } from '../utils/helpers'

const KEY = 'deeptrace-state-v1'
const AppContext = createContext(null)

const seedInvestigations = DEMO_CASES.map((c, i) => ({
  id: c.id,
  name: c.name,
  investigator: 'A. Rahman',
  description: c.description,
  createdAt: new Date(Date.now() - (i + 2) * 86400000).toISOString(),
  status: 'Complete',
  timeline: [
    { time: new Date(Date.now() - (i + 2) * 86400000).toISOString(), label: 'Investigation Created', desc: `Case ${c.id} opened` },
    { time: new Date(Date.now() - (i + 2) * 86400000 + 36e4).toISOString(), label: 'Evidence Added', desc: c.fileName },
    { time: new Date(Date.now() - (i + 2) * 86400000 + 72e4).toISOString(), label: 'Analysis Started', desc: 'Multimodal forensic pipeline' },
    { time: new Date(Date.now() - (i + 2) * 86400000 + 90e4).toISOString(), label: 'Signals Detected', desc: 'Visual · Audio · Temporal · Compression · Cross-Modal' },
    { time: new Date(Date.now() - (i + 2) * 86400000 + 108e4).toISOString(), label: 'Evidence Reviewed', desc: 'Analyst review of flagged regions' },
    { time: new Date(Date.now() - (i + 2) * 86400000 + 126e4).toISOString(), label: 'Assessment Generated', desc: c.expected },
  ],
}))

const seedEvidence = DEMO_CASES.map((c, i) => ({
  id: `EV-00${i + 1}`,
  caseId: c.id,
  caseName: c.name,
  filename: c.fileName,
  type: c.mime,
  kind: c.kind,
  size: c.size,
  hash: demoHash(c.seed),
  hashDemo: true,
  status: 'Analyzed',
  risk: i === 0 ? 'LOW' : i === 1 ? 'CRITICAL' : 'HIGH',
  date: new Date(Date.now() - (i + 2) * 86400000).toISOString(),
}))

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.investigations)) return parsed
    }
  } catch { /* corrupted state -> reseed */ }
  return { investigations: seedInvestigations, evidence: seedEvidence }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      const persist = {
        investigations: state.investigations,
        // strip non-serializable fields (object URLs, File refs, results kept)
        evidence: state.evidence.map(({ objectUrl, file, ...e }) => ({ objectUrl: undefined, ...e })),
      }
      localStorage.setItem(KEY, JSON.stringify(persist))
    } catch { /* storage full/blocked — app keeps working in-memory */ }
  }, [state])

  const api = useMemo(() => ({
    ...state,
    addInvestigation(inv) {
      setState((s) => ({ ...s, investigations: [inv, ...s.investigations] }))
    },
    addTimelineEvent(caseId, ev) {
      setState((s) => ({
        ...s,
        investigations: s.investigations.map((c) =>
          c.id === caseId ? { ...c, timeline: [...c.timeline, ev] } : c),
      }))
    },
    addEvidence(ev) {
      setState((s) => ({ ...s, evidence: [ev, ...s.evidence] }))
    },
    removeEvidence(id) {
      setState((s) => ({ ...s, evidence: s.evidence.filter((e) => e.id !== id) }))
    },
  }), [state])

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
