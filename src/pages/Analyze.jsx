import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Play, FileText, ShieldCheck, Eye, AudioLines, Clock3, Layers,
  GitCompareArrows, HelpCircle, Lock, FlaskConical,
} from 'lucide-react'
import UploadZone, { validateFile } from '../components/UploadZone'
import MediaPreview from '../components/MediaPreview'
import AnalysisPipeline from '../components/AnalysisPipeline'
import ScoreGauge from '../components/ScoreGauge'
import SignalCard from '../components/SignalCard'
import EvidenceCard from '../components/EvidenceCard'
import HeatmapViewer from '../components/HeatmapViewer'
import CrossModalPanel from '../components/CrossModalPanel'
import CompressionPanel from '../components/CompressionPanel'
import { ErrorMessage, RiskBadge, DemoRibbon } from '../components/Feedback'
import { analyzeMedia, mediaKindFromType } from '../engine/analyzeMedia'
import { DEMO_CASES } from '../engine/demoCases'
import { useApp } from '../store/AppContext'
import { sha256Hex, demoHash, uid } from '../utils/helpers'

export default function Analyze() {
  const { addEvidence, addInvestigation, addTimelineEvent, investigations } = useApp()
  const navigate = useNavigate()

  const [file, setFile] = useState(null)          // real File
  const [demo, setDemo] = useState(null)          // demo descriptor
  const [objectUrl, setObjectUrl] = useState(null)
  const [meta, setMeta] = useState({})
  const [caseId, setCaseId] = useState('')
  const [caseName, setCaseName] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const pendingRef = useRef(null)
  const resultsRef = useRef(null)

  useEffect(() => () => { if (objectUrl) URL.revokeObjectURL(objectUrl) }, [objectUrl])
  useEffect(() => {
    if (result) resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [result])

  const kind = useMemo(() => demo?.kind || (file ? mediaKindFromType(file.type) : null), [file, demo])

  const clearMedia = () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    setFile(null); setDemo(null); setObjectUrl(null); setMeta({}); setResult(null); setAnalyzing(false)
  }

  const onFile = (f) => {
    setError(null); setResult(null)
    const err = validateFile(f)
    if (err) { setError(err); return }
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    setFile(f); setDemo(null)
    setObjectUrl(URL.createObjectURL(f))
    if (!caseName) setCaseName(`Analysis of ${f.name}`)
  }

  const onDemoSelect = (c) => {
    setError(null); setResult(null)
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    setFile(null); setDemo(c); setObjectUrl(null)
    setCaseId(c.id)
    setCaseName(c.name)
    setMeta({ duration: c.duration })
  }

  const startAnalysis = () => {
    setError(null)
    if (!file && !demo) { setError('No media selected. Upload a file or load demo evidence first.'); return }
    if (!caseId.trim()) { setError('Case ID is required before starting analysis.'); return }
    if (!caseName.trim()) { setError('Investigation name is required before starting analysis.'); return }
    setAnalyzing(true)
    setResult(null)
    pendingRef.current = analyzeMedia({
      file, demo, kind,
      duration: meta.duration || demo?.duration || null,
      hasAudio: kind === 'video' ? true : undefined,
    })
  }

  const onPipelineComplete = async () => {
    try {
      const res = await pendingRef.current
      // Hash: real SHA-256 for real files, clearly-labeled demo hash otherwise
      let hash, hashDemo
      if (file) {
        try { hash = await sha256Hex(file); hashDemo = false }
        catch { hash = demoHash(file.name + file.size); hashDemo = true }
      } else {
        hash = demoHash(demo.seed); hashDemo = true
      }

      const exists = investigations.some((c) => c.id === caseId.trim())
      if (!exists) {
        addInvestigation({
          id: caseId.trim(), name: caseName.trim(), investigator: 'Demo Analyst',
          description: notes.trim() || '—', createdAt: new Date().toISOString(), status: 'Complete',
          timeline: [],
        })
      }
      const now = () => new Date().toISOString()
      addTimelineEvent(caseId.trim(), { time: now(), label: 'Evidence Added', desc: file?.name || demo.fileName })
      addTimelineEvent(caseId.trim(), { time: now(), label: 'Analysis Started', desc: 'Multimodal forensic pipeline' })
      addTimelineEvent(caseId.trim(), { time: now(), label: 'Signals Detected', desc: 'Visual · Audio · Temporal · Compression · Cross-Modal' })
      addTimelineEvent(caseId.trim(), { time: now(), label: 'Assessment Generated', desc: res.classification })

      addEvidence({
        id: uid('EV'), caseId: caseId.trim(), caseName: caseName.trim(),
        filename: file?.name || demo.fileName,
        type: file?.type || demo.mime, kind,
        size: file?.size ?? demo.size,
        hash, hashDemo,
        status: 'Analyzed', risk: res.risk, date: now(),
        notes: notes.trim(),
        result: res,
        poster: demo?.poster || null,
      })

      setResult(res)
      setAnalyzing(false)
    } catch (e) {
      console.error(e)
      setAnalyzing(false)
      setError('Analysis failed while processing the media. Please try another file or a demo case.')
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div className="flex-between">
          <div>
            <h1>Analyze Media</h1>
            <p>Submit digital evidence to the multimodal forensic pipeline.</p>
          </div>
          <DemoRibbon />
        </div>
      </header>

      {error && <div style={{ marginBottom: 18 }}><ErrorMessage title="Unable to proceed" message={error} onDismiss={() => setError(null)} /></div>}

      {!file && !demo && (
        <>
          <UploadZone onFile={onFile} onDemo={() => document.getElementById('demo-cases')?.scrollIntoView({ behavior: 'smooth' })} />
          <div id="demo-cases" className="grid cols-3 mt-26">
            {DEMO_CASES.map((c) => (
              <div className="card" key={c.id} style={{ cursor: 'pointer' }} onClick={() => onDemoSelect(c)}
                role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onDemoSelect(c)}>
                <div className="flex-between" style={{ marginBottom: 10 }}>
                  <span className="mono" style={{ color: 'var(--cyan)' }}>{c.id}</span>
                  <span className="badge purple"><FlaskConical size={12} /> DEMO</span>
                </div>
                <h4 style={{ margin: '0 0 6px' }}>{c.name}</h4>
                <p style={{ margin: '0 0 10px', color: 'var(--text-2)', fontSize: '0.83rem' }}>{c.description}</p>
                <span className="tag-mono">Expected: {c.expected}</span>
              </div>
            ))}
          </div>
          <p className="notice privacy mt-26">
            <Lock size={17} color="#a78bfa" />
            <span><strong>Privacy notice:</strong> Media uploaded to this prototype is intended for
            demonstration purposes. Do not upload sensitive personal information. Files are processed
            locally in your browser and are not sent to any server.</span>
          </p>
        </>
      )}

      {(file || demo) && !result && (
        <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
          <MediaPreview
            file={file} demo={demo} objectUrl={objectUrl}
            onRemove={clearMedia} onMetadata={setMeta}
          />
          <div className="card">
            <h3 className="card-title">Investigation Details</h3>
            <div className="grid cols-3" style={{ marginTop: 14 }}>
              <div className="field">
                <label htmlFor="caseId">Case ID *</label>
                <input id="caseId" value={caseId} onChange={(e) => setCaseId(e.target.value)} placeholder="CASE-004" />
              </div>
              <div className="field">
                <label htmlFor="caseName">Investigation Name *</label>
                <input id="caseName" value={caseName} onChange={(e) => setCaseName(e.target.value)} placeholder="e.g. Viral clip verification" />
              </div>
              <div className="field">
                <label htmlFor="notes">Investigator Notes</label>
                <input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional context…" />
              </div>
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={startAnalysis} disabled={analyzing}>
                <Play size={17} /> Start Forensic Analysis
              </button>
              <DemoRibbon />
            </div>
          </div>
          <AnalysisPipeline running={analyzing} onComplete={onPipelineComplete} />
        </div>
      )}

      {result && (
        <div ref={resultsRef} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <span className="badge complete" style={{ marginBottom: 6 }}><ShieldCheck size={13} /> FORENSIC ANALYSIS COMPLETE</span>
            <DemoRibbon />
          </div>

          {/* Fusion */}
          <section className="card">
            <h2 className="section-title"><Layers size={19} color="#22d3ee" /> Multi-Signal Evidence Fusion</h2>
            <p className="section-sub">
              DeepTrace combines multiple independent forensic signals instead of relying on a
              single visual artifact.
            </p>
            <div className="grid cols-5" style={{ marginBottom: 22 }}>
              <SignalCard icon={Eye} name="Visual Evidence" value={result.visualScore} />
              <SignalCard icon={AudioLines} name="Audio Evidence" value={result.audioScore} />
              <SignalCard icon={Clock3} name="Temporal Evidence" value={result.temporalScore} />
              <SignalCard icon={Layers} name="Compression Evidence" value={result.compressionScore} />
              <SignalCard icon={GitCompareArrows} name="Cross-Modal Consistency" value={result.crossModalScore} />
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'auto 1fr', alignItems: 'center', gap: 30 }}>
              <ScoreGauge score={result.authenticityScore} classification={result.classification} />
              <div className="grid cols-2">
                <div className="card signal-card">
                  <span className="signal-name">Confidence</span>
                  <div className="signal-score" style={{ color: '#22d3ee' }}>{result.confidence}%</div>
                </div>
                <div className="card signal-card">
                  <span className="signal-name">Risk</span>
                  <div style={{ marginTop: 10 }}><RiskBadge level={result.risk} /></div>
                </div>
                <p className="notice" style={{ gridColumn: '1 / -1' }}>
                  Classification bands: 80–100 Likely Authentic · 60–79 Review Recommended ·
                  40–59 Suspicious · 0–39 Likely Manipulated. A score is never absolute proof.
                </p>
              </div>
            </div>
          </section>

          {/* Explainability */}
          <section>
            <h2 className="section-title"><HelpCircle size={19} color="#8b5cf6" /> Why did DeepTrace reach this conclusion?</h2>
            <p className="section-sub">Every assessment is backed by inspectable evidence signals.</p>
            <div className="grid cols-3">
              {result.findings.map((f) => <EvidenceCard key={f.key} finding={f} />)}
            </div>
          </section>

          <HeatmapViewer
            kind={kind} src={objectUrl} poster={demo?.poster}
            regions={result.suspiciousRegions} frames={result.suspiciousFrames}
            audioSegments={result.audioSegments} duration={result.duration}
            seed={result.authenticityScore * 31 + 7}
          />

          <CrossModalPanel lipSyncScore={result.lipSyncScore} events={result.lipSyncEvents} duration={result.duration} />

          <CompressionPanel test={result.compressionTest} />

          <div className="flex-between no-print">
            <button className="btn" onClick={clearMedia}>Analyze Another File</button>
            <button className="btn btn-primary" onClick={() => navigate('/reports')}>
              <FileText size={16} /> Generate Forensic Report
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
