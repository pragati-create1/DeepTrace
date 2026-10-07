import React, { useRef, useState } from 'react'
import { UploadCloud, FolderSearch, FlaskConical } from 'lucide-react'

export const ACCEPTED = {
  'image/jpeg': 'JPG', 'image/png': 'PNG', 'image/webp': 'WEBP',
  'video/mp4': 'MP4', 'video/quicktime': 'MOV', 'video/x-msvideo': 'AVI',
  'audio/mpeg': 'MP3', 'audio/wav': 'WAV', 'audio/x-wav': 'WAV', 'audio/mp4': 'M4A', 'audio/x-m4a': 'M4A',
}
const EXT_MAP = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', mp4: 'video/mp4', mov: 'video/quicktime', avi: 'video/x-msvideo', mp3: 'audio/mpeg', wav: 'audio/wav', m4a: 'audio/mp4' }
export const MAX_SIZE = 200 * 1024 * 1024 // 200 MB

export function validateFile(file) {
  if (!file) return 'No file provided.'
  if (file.size === 0) return 'The selected file is empty or invalid.'
  if (file.size > MAX_SIZE) return 'File exceeds the 200 MB demo limit. Please choose a smaller file.'
  let ok = !!ACCEPTED[file.type]
  if (!ok) {
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    ok = !!EXT_MAP[ext]
  }
  if (!ok) return `Unsupported format. Supported: ${[...new Set(Object.values(ACCEPTED))].join(', ')}.`
  return null
}

export default function UploadZone({ onFile, onDemo }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer?.files?.[0]
    if (f) onFile(f)
  }

  return (
    <div
      className={`upload-zone ${dragging ? 'dragging' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
      aria-label="Upload digital evidence: drop an image, video, or audio file"
    >
      <div className="upload-icon"><UploadCloud size={30} color="#22d3ee" /></div>
      <h3>Upload Digital Evidence</h3>
      <p>Drop an image, video, or audio file for forensic analysis.</p>
      <div className="format-chips" aria-label="Supported formats">
        {[...new Set(Object.values(ACCEPTED))].map((f) => <span key={f} className="format-chip">{f}</span>)}
      </div>
      <div className="upload-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
        >
          <FolderSearch size={17} /> Browse Files
        </button>
        <button
          type="button"
          className="btn"
          onClick={(e) => { e.stopPropagation(); onDemo?.() }}
        >
          <FlaskConical size={17} /> Load Demo Evidence
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={Object.keys(ACCEPTED).join(',')}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = '' }}
        aria-label="Choose media file"
      />
    </div>
  )
}
