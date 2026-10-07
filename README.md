# DEEPTRACE

**"Trace the Evidence. Reveal the Truth."**

**Problem:** HNX26PSI10 — Multimodal Deepfake & Digital Forensics

DeepTrace is a professional digital-forensics command center that analyzes images, videos and
audio to determine whether media is **likely authentic or manipulated — and why**.

---

## Solution

Instead of trusting a single deepfake artifact, DeepTrace correlates five independent forensic
signals and fuses them into one explainable authenticity assessment:

```
Visual Evidence + Audio Evidence + Temporal Evidence + Compression Evidence + Cross-Modal Consistency
        ↓
MULTI-SIGNAL EVIDENCE FUSION
        ↓
AUTHENTICITY SCORE
        ↓
EXPLAINABLE FORENSIC REPORT
```

## Key Innovation

**DEEPTRACE DOESN'T TRUST A SINGLE ARTIFACT.**
Single-artifact detectors fail on unseen manipulation methods and break under compression.
DeepTrace is **generalization-first**: it correlates multiple weak signals so detection degrades
gracefully and every verdict is explainable.

## Features

- **Dashboard** — command-center stats, radar overview of signal strength, recent investigations
- **Analyze Media** — drag & drop upload (JPG/PNG/WEBP/MP4/MOV/AVI/MP3/WAV/M4A), real media preview,
  animated 7-stage forensic pipeline
- **Multi-Signal Evidence Fusion** — Visual / Audio / Temporal / Compression / Cross-Modal score
  cards + circular authenticity gauge, confidence and risk
- **Explainable AI** — dynamic evidence cards ("Why did DeepTrace reach this conclusion?")
- **Manipulation Evidence Map** — simulated heatmap overlays, bounding boxes, flagged frames and
  suspicious audio segments
- **Cross-Modal Consistency** — lip-sync scoring with an event timeline (video with audio)
- **Compression Robustness Test** — ORIGINAL → COMPRESSION → RE-ENCODING → RE-ANALYSIS with
  before/after signal stability
- **Investigations** — case management with forensic timelines
- **Evidence Repository** — real in-browser SHA-256 hashing (demo items labeled `DEMO HASH`)
- **Reports** — professional printable forensic report (Print → Save as PDF) + HTML download
- **Demo Cases** — CASE-001 Authentic Interview, CASE-002 Face Manipulation, CASE-003 A/V Sync Test
- Dark glassmorphism UI, responsive (sidebar → collapsible → bottom nav), accessible controls

## Architecture

```
React Frontend
    ↓
FastAPI Backend            ← future integration (frontend works without it)
    ↓
Media Preprocessing
    ↓
Computer Vision Model / Audio Forensics Model / Temporal Analysis
    ↓
Cross-Modal Model → Evidence Fusion → Explainability Layer → Final Report
```

## Technology Stack

React 18 · Vite 5 · JavaScript (JSX) · React Router 6 · Lucide React · Chart.js · plain CSS

## Installation

```bash
npm install
```

## Running the Project

```bash
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # preview production build
```

## Demo Mode

**DEMO MODE — Simulated forensic analysis.** No real ML model is connected. Scores are produced
by `src/engine/analyzeMedia.js`, a deterministic heuristic seeded by the file's fingerprint
(same file → similar results). They are **not** scientifically validated AI predictions.

## Future AI Integration

Replace the body of `analyzeMedia()` in `src/engine/analyzeMedia.js` with a `fetch` call to a
FastAPI backend that returns the same result contract
(`authenticityScore`, `confidence`, `riskLevel`, per-signal scores, `findings`,
`suspiciousFrames`, `suspiciousRegions`, `audioSegments`, `lipSyncScore`…). No UI changes needed.

## Limitations

- All scores are simulated; not conclusive forensic evidence.
- Uploaded media is processed locally in the browser; no cloud storage or encryption is provided.
  Do not upload sensitive personal information.
- Demo cases use synthetic poster art and simulated metadata (clearly labeled).
