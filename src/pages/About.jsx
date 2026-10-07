import React from 'react'
import { ArrowDown, ShieldCheck, HelpCircle, Layers, GitBranch, Award } from 'lucide-react'
import Logo from '../components/Logo'

const ARCH = [
  { label: 'MEDIA INPUT', cls: 'accent' },
  { label: 'PREPROCESSING', cls: '' },
  { label: 'VISUAL · AUDIO · TEMPORAL · COMPRESSION ANALYSIS', cls: '' },
  { label: 'CROSS-MODAL CONSISTENCY', cls: 'purple' },
  { label: 'MULTI-SIGNAL EVIDENCE FUSION', cls: 'purple' },
  { label: 'AUTHENTICITY SCORE', cls: 'accent' },
  { label: 'EXPLAINABLE FORENSIC REPORT', cls: 'accent' },
]

const FUTURE = [
  'React Frontend', 'FastAPI Backend', 'Media Preprocessing', 'Computer Vision Model',
  'Audio Forensics Model', 'Temporal Analysis', 'Cross-Modal Model',
  'Evidence Fusion', 'Explainability Layer', 'Final Report',
]

const GENERALIZATION = [
  'KNOWN MANIPULATION', 'UNKNOWN MANIPULATION', 'COMPRESSION VARIATION',
  'CROPPED MEDIA', 'RE-ENCODED MEDIA', 'CROSS-MODAL INCONSISTENCY',
]

export default function About() {
  return (
    <div className="page">
      <header className="page-header" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 34px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}><Logo size={52} /></div>
        <h1 style={{ letterSpacing: '0.12em' }}>DEEPTRACE</h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--cyan)' }}>"Trace the Evidence. Reveal the Truth."</p>
        <p style={{ margin: '10px auto 0' }}>
          DeepTrace is a multimodal deepfake and digital-forensics platform that assesses whether
          images, videos and audio are likely authentic or manipulated — and explains <em>why</em>.
        </p>
        <div style={{ marginTop: 14 }}><span className="badge purple"><Award size={12} /> GENERALIZATION-FIRST ARCHITECTURE</span></div>
      </header>

      <div className="grid cols-2">
        <div className="card">
          <h3 className="card-title"><HelpCircle size={18} color="#22d3ee" /> Why deepfakes are hard to detect</h3>
          <p className="card-sub" style={{ lineHeight: 1.7 }}>
            Modern generative models remove the obvious artifacts detectors were trained on.
            Compression, cropping and re-encoding destroy weak signals further. A detector that
            memorizes one known artifact fails on the next unseen manipulation — which is why
            <strong> one artifact is not enough</strong>.
          </p>
        </div>
        <div className="card">
          <h3 className="card-title"><Layers size={18} color="#8b5cf6" /> Why multimodal matters</h3>
          <p className="card-sub" style={{ lineHeight: 1.7 }}>
            Manipulators rarely fake every modality equally well. Texture may look right while the
            voice spectrum, blink dynamics, or lip-sync timing disagree. DeepTrace correlates
            independent visual, audio, temporal, compression and cross-modal signals, then fuses
            them into a single <strong>explainable</strong> authenticity score.
          </p>
        </div>
      </div>

      <div className="grid cols-2 mt-18">
        <div className="card">
          <h3 className="card-title"><ShieldCheck size={18} color="#34d399" /> Why explainability matters</h3>
          <p className="card-sub" style={{ lineHeight: 1.7 }}>
            Forensic findings must be defensible. DeepTrace never shows only a score — every verdict
            is accompanied by evidence cards, suspicious regions, frames and timestamps that an
            analyst can inspect and challenge.
          </p>
        </div>
        <div className="card">
          <h3 className="card-title"><GitBranch size={18} color="#fbbf24" /> Why generalization matters</h3>
          <p className="card-sub" style={{ lineHeight: 1.7 }}>
            DeepTrace is designed around multiple signals instead of memorizing one known deepfake
            artifact, so it degrades gracefully on unknown manipulations and common transformations.
          </p>
        </div>
      </div>

      <div className="card mt-26">
        <h3 className="card-title">System Architecture</h3>
        <div className="flow" style={{ marginTop: 18 }}>
          {ARCH.map((n, i) => (
            <React.Fragment key={n.label}>
              <div className={`flow-node ${n.cls}`}>{n.label}</div>
              {i < ARCH.length - 1 && <ArrowDown className="flow-arrow" size={18} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="card mt-26">
        <h3 className="card-title">Generalization-Oriented Detection</h3>
        <p className="card-sub">Designed to remain useful across manipulation types and transformations:</p>
        <div className="flow-row" style={{ marginBottom: 22 }}>
          {GENERALIZATION.map((g) => <div key={g} className="flow-node">{g}</div>)}
        </div>
        <div className="flow">
          {['SINGLE ARTIFACT', 'MULTIPLE SIGNALS', 'EVIDENCE CORRELATION', 'EVIDENCE FUSION', 'EXPLAINABLE DECISION'].map((s, i, arr) => (
            <React.Fragment key={s}>
              <div className={`flow-node ${i === arr.length - 1 ? 'accent' : ''}`}>{s}</div>
              {i < arr.length - 1 && <ArrowDown className="flow-arrow" size={18} />}
            </React.Fragment>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <span className="badge purple"><Award size={12} /> GENERALIZATION-FIRST ARCHITECTURE</span>
        </div>
      </div>

      <div className="card mt-26">
        <h3 className="card-title">Future AI Backend Integration</h3>
        <p className="card-sub">
          The demo engine (<span className="tag-mono">src/engine/analyzeMedia.js</span>) is a drop-in
          seam. A production backend can replace it without touching the UI:
        </p>
        <div className="flow-row">
          {FUTURE.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flow-node" style={{ flex: '1 1 160px' }}>{s}</div>
              {i < FUTURE.length - 1 && <ArrowDown className="flow-arrow" size={16} style={{ transform: 'rotate(-90deg)', alignSelf: 'center' }} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
