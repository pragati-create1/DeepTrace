import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Database, ShieldCheck, AlertTriangle, AlertOctagon, Plus,
  Eye, AudioLines, Clock3, Layers, GitCompareArrows, ArrowRight,
} from 'lucide-react'
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import StatCard from '../components/StatCard'
import InvestigationTable from '../components/InvestigationTable'
import { useApp } from '../store/AppContext'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const CLASS_FROM_RISK = { LOW: 'LIKELY AUTHENTIC', MEDIUM: 'REVIEW RECOMMENDED', HIGH: 'SUSPICIOUS', CRITICAL: 'LIKELY MANIPULATED' }

export default function Dashboard() {
  const { evidence, investigations } = useApp()
  const navigate = useNavigate()

  const stats = useMemo(() => ({
    total: evidence.length,
    authentic: evidence.filter((e) => e.risk === 'LOW').length,
    suspicious: evidence.filter((e) => e.risk === 'MEDIUM' || e.risk === 'HIGH').length,
    highRisk: evidence.filter((e) => e.risk === 'CRITICAL').length,
  }), [evidence])

  const rows = useMemo(() => evidence.slice(0, 6).map((e) => ({
    key: e.id,
    caseId: e.caseId,
    evidence: e.filename,
    mediaType: e.kind.toUpperCase(),
    authenticity: e.result?.classification || CLASS_FROM_RISK[e.risk] || 'REVIEW RECOMMENDED',
    risk: e.risk,
    date: e.date,
    status: e.status,
  })), [evidence])

  const radarData = useMemo(() => {
    const withRes = evidence.filter((e) => e.result)
    const avg = (key, fallback) => {
      const vals = withRes.map((e) => e.result[key]).filter((v) => v != null)
      return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : fallback
    }
    return {
      labels: ['Visual', 'Audio', 'Temporal', 'Compression', 'Cross-Modal'],
      datasets: [{
        label: 'Mean Signal Strength',
        data: [avg('visualScore', 82), avg('audioScore', 71), avg('temporalScore', 86), avg('compressionScore', 76), avg('crossModalScore', 66)],
        backgroundColor: 'rgba(34, 211, 238, 0.14)',
        borderColor: '#22d3ee',
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#22d3ee',
        borderWidth: 2,
      }],
    }
  }, [evidence])

  const radarOptions = {
    responsive: true, maintainAspectRatio: false,
    scales: {
      r: {
        min: 0, max: 100,
        ticks: { display: false, stepSize: 25 },
        grid: { color: 'rgba(125,166,255,0.12)' },
        angleLines: { color: 'rgba(125,166,255,0.12)' },
        pointLabels: { color: '#9fb0d0', font: { size: 11, family: 'Inter, sans-serif' } },
      },
    },
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0a1226', borderColor: '#22d3ee', borderWidth: 1 } },
  }

  const signalSummary = [
    { icon: Eye, label: 'Visual Analysis', value: radarData.datasets[0].data[0] },
    { icon: AudioLines, label: 'Audio Analysis', value: radarData.datasets[0].data[1] },
    { icon: Clock3, label: 'Temporal Analysis', value: radarData.datasets[0].data[2] },
    { icon: Layers, label: 'Compression Analysis', value: radarData.datasets[0].data[3] },
    { icon: GitCompareArrows, label: 'Cross-Modal Analysis', value: radarData.datasets[0].data[4] },
  ]

  return (
    <div className="page">
      <header className="page-header">
        <div className="flex-between">
          <div>
            <h1>Digital Forensics Command Center</h1>
            <p>Analyze multimedia evidence through multiple independent forensic signals.</p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/analyze')}>
            <Plus size={18} /> New Investigation
          </button>
        </div>
      </header>

      <section className="hero-banner" aria-label="DeepTrace principle">
        <h2>DEEPTRACE DOESN'T TRUST A SINGLE ARTIFACT.</h2>
        <p>It correlates multiple forensic signals to build an explainable authenticity assessment.</p>
        <div className="workflow" aria-label="Workflow: upload, trace, correlate, explain, report">
          {['UPLOAD', 'TRACE', 'CORRELATE', 'EXPLAIN', 'REPORT'].map((s, i) => (
            <React.Fragment key={s}>
              <span className="workflow-step">{s}</span>
              {i < 4 && <ArrowRight size={15} className="workflow-arrow" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      <div className="grid cols-4 mt-26">
        <StatCard icon={Database} label="Total Evidence" value={stats.total} tint="cyan" trend="All media items" />
        <StatCard icon={ShieldCheck} label="Authentic" value={stats.authentic} tint="green" trend="Low risk verdicts" />
        <StatCard icon={AlertTriangle} label="Suspicious" value={stats.suspicious} tint="amber" trend="Needs analyst review" />
        <StatCard icon={AlertOctagon} label="High Risk" value={stats.highRisk} tint="red" trend="Escalation advised" />
      </div>

      <div className="grid mt-26" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
        <section className="card">
          <div className="flex-between" style={{ marginBottom: 14 }}>
            <h3 className="card-title" style={{ margin: 0 }}>Recent Investigations</h3>
            <button className="btn btn-sm btn-ghost" onClick={() => navigate('/investigations')}>View all</button>
          </div>
          <InvestigationTable rows={rows} onSelect={() => navigate('/investigations')} />
        </section>

        <section className="card">
          <h3 className="card-title">Multimodal Detection Overview</h3>
          <p className="card-sub">Mean signal strength across analyzed evidence</p>
          <div style={{ height: 240 }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </section>
      </div>

      <div className="grid cols-5 mt-26">
        {signalSummary.map(({ icon: Icon, label, value }) => (
          <div className="card signal-card" key={label}>
            <div className="signal-head">
              <span className="signal-name"><Icon size={15} color="#22d3ee" /> {label}</span>
            </div>
            <div className="signal-score">{value}%</div>
            <div className="progress-bar" style={{ marginTop: 10 }}>
              <div className="progress-fill" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
