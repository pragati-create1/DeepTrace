import React from 'react'
import { Flame } from 'lucide-react'
import AudioVisualizer from './AudioVisualizer'
import Timeline from './Timeline'

/**
 * Manipulation Evidence Map — simulated highlighted regions, bounding
 * boxes and heatmap overlays on top of the uploaded media.
 */
export default function HeatmapViewer({ kind, src, poster, regions = [], frames = [], audioSegments = [], duration = 15, seed = 11 }) {
  return (
    <section className="card" aria-label="Manipulation Evidence Map">
      <h3 className="card-title"><Flame size={18} color="#fb923c" /> Manipulation Evidence Map</h3>
      <p className="card-sub">Simulated localization of areas requiring forensic review.</p>

      {(kind === 'image' || kind === 'video') && (
        <div className="heatmap-stage">
          {kind === 'image'
            ? <img src={src} alt="Evidence with highlighted forensic regions" />
            : src
              ? <video src={src} poster={poster} controls preload="metadata" />
              : <img src={poster} alt="Video poster frame with highlighted forensic regions" />}
          {/* heat blobs */}
          {regions.map((r) => (
            <div
              key={`blob-${r.id}`}
              className="heat-blob"
              style={{
                left: `${r.x - 6}%`, top: `${r.y - 6}%`,
                width: `${r.w + 12}%`, height: `${r.h + 12}%`,
                background: r.severity === 'high'
                  ? 'radial-gradient(circle, rgba(248,113,113,0.5) 0%, rgba(251,146,60,0.28) 45%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(251,191,36,0.42) 0%, rgba(251,191,36,0.18) 45%, transparent 70%)',
              }}
            />
          ))}
          {/* bounding boxes */}
          {regions.map((r) => (
            <div
              key={`box-${r.id}`}
              className={`bbox ${r.severity === 'high' ? '' : 'moderate'}`}
              style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }}
            >
              <span className="bbox-label">{r.label}</span>
            </div>
          ))}
        </div>
      )}

      {kind === 'video' && frames.length > 0 && (
        <div className="mt-18">
          <div className="mono" style={{ color: 'var(--text-3)', marginBottom: 8, fontSize: '0.72rem' }}>
            FLAGGED FRAME TIMELINE
          </div>
          <Timeline duration={duration} markers={frames.map((f) => ({
            at: parseFloat(f.time.split(':')[0]) * 60 + parseFloat(f.time.split(':')[1]),
            label: `Frame ${f.frame}`,
            tone: 'bad',
          }))} />
          <div className="event-list">
            {frames.map((f) => (
              <div key={f.frame} className="event-row">
                <span className="event-dot" style={{ background: '#f87171' }} />
                <span className="event-time">{f.time}</span>
                <span>Frame {f.frame} — {f.note}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(kind === 'audio' || (kind === 'video' && audioSegments.length > 0)) && (
        <div className="mt-18">
          <div className="mono" style={{ color: 'var(--text-3)', marginBottom: 8, fontSize: '0.72rem' }}>
            AUDIO SIGNAL — HIGHLIGHTED SEGMENTS
          </div>
          <AudioVisualizer duration={duration} segments={audioSegments} seed={seed} />
          <div className="event-list">
            {audioSegments.map((s, i) => (
              <div key={i} className="event-row">
                <span className="event-dot" style={{ background: '#fb923c' }} />
                <span className="event-time">{s.startLabel} – {s.endLabel}</span>
                <span>{s.note}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="notice" style={{ marginTop: 18 }}>
        Highlighted regions indicate areas requiring forensic review. They are evidence signals,
        not definitive proof of manipulation.
      </p>
    </section>
  )
}
