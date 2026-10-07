import React, { useEffect, useRef, useState } from 'react'
import { CheckCircle2, ShieldCheck } from 'lucide-react'

const STAGES = [
  'Media Integrity',
  'Visual Forensics',
  'Audio Forensics',
  'Temporal Analysis',
  'Compression Analysis',
  'Cross-Modal Analysis',
  'Evidence Fusion',
]

const PHASES = ['Scanning…', 'Analyzing…']

export default function AnalysisPipeline({ running, onComplete }) {
  const [stage, setStage] = useState(-1)
  const [phase, setPhase] = useState(0)
  const [done, setDone] = useState(false)
  const firedRef = useRef(false)

  useEffect(() => {
    if (!running) { setStage(-1); setPhase(0); setDone(false); firedRef.current = false; return }
    let s = 0, p = 0
    setStage(0); setPhase(0)
    const iv = setInterval(() => {
      p++
      if (p >= PHASES.length) { p = 0; s++ }
      if (s >= STAGES.length) {
        clearInterval(iv)
        setDone(true)
        setStage(STAGES.length)
        if (!firedRef.current) { firedRef.current = true; setTimeout(() => onComplete?.(), 450) }
        return
      }
      setStage(s); setPhase(p)
    }, 520)
    return () => clearInterval(iv)
  }, [running, onComplete])

  if (!running && !done) return null
  const progress = done ? 100 : Math.min(99, ((stage + phase / PHASES.length) / STAGES.length) * 100)

  return (
    <div className="card" aria-live="polite">
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <h3 className="card-title"><ShieldCheck size={19} color="#22d3ee" /> Forensic Analysis Pipeline</h3>
        {done
          ? <span className="badge complete"><CheckCircle2 size={13} /> FORENSIC ANALYSIS COMPLETE</span>
          : <span className="badge processing"><span className="spinner" /> PROCESSING</span>}
      </div>
      <div className="pipeline">
        {STAGES.map((name, i) => {
          const state = done || i < stage ? 'done' : i === stage ? 'active' : ''
          return (
            <div key={name} className={`pipeline-stage ${state}`}>
              <span className="stage-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="stage-name">{name}</span>
              <span className="stage-state">
                {state === 'done' && <><CheckCircle2 size={14} /> Completed ✓</>}
                {state === 'active' && <><span className="spinner" /> {PHASES[phase]}</>}
                {!state && 'Queued'}
              </span>
            </div>
          )
        })}
      </div>
      <div className="progress-bar" style={{ marginTop: 16 }}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
