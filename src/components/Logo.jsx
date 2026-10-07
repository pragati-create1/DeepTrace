import React from 'react'

/** Digital magnifying glass + trace/waveform mark */
export default function Logo({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="17" cy="17" r="10.5" stroke="#22d3ee" strokeWidth="2.6" />
      <path d="M25 25 L34 34" stroke="#8b5cf6" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M9.5 17 h3 l2 -4.5 l2.6 9 l2 -4.5 h5.4" stroke="#3b82f6" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}
