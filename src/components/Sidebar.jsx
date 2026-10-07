import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, ScanSearch, FolderOpen, Database, FileText, Info, Menu, X,
} from 'lucide-react'
import Logo from './Logo'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/analyze', label: 'Analyze Media', icon: ScanSearch },
  { to: '/investigations', label: 'Investigations', icon: FolderOpen },
  { to: '/evidence', label: 'Evidence', icon: Database },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/about', label: 'About', icon: Info },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => { setOpen(false) }, [loc.pathname])

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Primary navigation">
        <div className="sidebar-logo">
          <div className="logo-mark"><Logo size={24} /></div>
          <div className="logo-text">
            <strong>DEEPTRACE</strong>
            <span>Multimodal Digital Forensics</span>
          </div>
        </div>

        <nav>
          <div className="nav-label">Forensic Console</div>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <span className={`nav-item ${isActive ? 'active' : ''}`}>
                  <Icon size={18} /> {label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="status-pill" title="Forensic engine status">
            <span className="dot green" /> FORENSIC ENGINE ONLINE
          </div>
          <div className="status-pill" title="Analysis is simulated for demonstration">
            <span className="dot amber" /> DEMO MODE ACTIVE
          </div>
        </div>
      </aside>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        {NAV.slice(0, 5).map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'active' : '')}>
            <Icon size={19} />
            {label.split(' ')[0]}
          </NavLink>
        ))}
      </nav>
    </>
  )
}
