import React, { useEffect, useRef, useState } from 'react'
import { FileAudio, Trash2 } from 'lucide-react'
import AudioVisualizer from './AudioVisualizer'
import { fmtBytes } from '../utils/helpers'

/**
 * Previews real File objects (image/video/audio) or demo descriptors.
 * Extracts only REAL metadata (resolution/duration) when available.
 */
export default function MediaPreview({ file, demo, objectUrl, onRemove, onMetadata }) {
  const [meta, setMeta] = useState({})
  const mediaRef = useRef(null)

  const kind = demo?.kind || (file?.type?.startsWith('image/') ? 'image'
    : file?.type?.startsWith('video/') ? 'video' : 'audio')
  const src = objectUrl || demo?.poster
  const name = file?.name || demo?.fileName
  const size = file?.size ?? demo?.size
  const type = file?.type || demo?.mime

  useEffect(() => {
    setMeta({})
  }, [src])

  const report = (m) => {
    const clean = Object.fromEntries(Object.entries(m).filter(([, v]) => v != null && !Number.isNaN(v)))
    setMeta(clean)
    onMetadata?.(clean)
  }

  return (
    <div className="media-preview-wrap">
      <div className="media-stage">
        {kind === 'image' && (
          <img
            src={src} alt={`Evidence preview: ${name}`}
            onLoad={(e) => report({ width: e.target.naturalWidth, height: e.target.naturalHeight })}
          />
        )}
        {kind === 'video' && (
          <video
            ref={mediaRef} src={demo && !objectUrl ? undefined : src} poster={demo?.poster}
            controls preload="metadata"
            onLoadedMetadata={(e) => report({
              duration: e.target.duration && isFinite(e.target.duration) ? e.target.duration : demo?.duration,
              width: e.target.videoWidth || undefined,
              height: e.target.videoHeight || undefined,
            })}
          >
            Your browser does not support video preview.
          </video>
        )}
        {kind === 'audio' && (
          <div className="audio-stage" style={{ width: '100%' }}>
            <FileAudio size={40} color="#22d3ee" />
            {objectUrl ? (
              <audio
                controls src={objectUrl} style={{ width: '100%' }}
                onLoadedMetadata={(e) => report({ duration: isFinite(e.target.duration) ? e.target.duration : null })}
              >
                Your browser does not support audio playback.
              </audio>
            ) : (
              <span className="mono" style={{ color: 'var(--text-3)' }}>DEMO AUDIO — simulated waveform</span>
            )}
            <AudioVisualizer duration={meta.duration || demo?.duration || 15} segments={[]} seed={42} height={70} />
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 18 }}>
        <h4 className="card-title" style={{ fontSize: '0.9rem' }}>File Metadata</h4>
        <table className="meta-table">
          <tbody>
            <tr><td>Filename</td><td>{name}</td></tr>
            <tr><td>Type</td><td>{type || 'unknown'}</td></tr>
            <tr><td>Size</td><td>{fmtBytes(size)}{demo ? ' (simulated)' : ''}</td></tr>
            {meta.width && <tr><td>Resolution</td><td>{meta.width} × {meta.height}</td></tr>}
            {meta.duration && <tr><td>Duration</td><td>{meta.duration.toFixed(1)} s{demo && !objectUrl ? ' (simulated)' : ''}</td></tr>}
          </tbody>
        </table>
        {onRemove && (
          <button className="btn btn-danger btn-sm" style={{ marginTop: 14 }} onClick={onRemove}>
            <Trash2 size={15} /> Remove File
          </button>
        )}
      </div>
    </div>
  )
}
