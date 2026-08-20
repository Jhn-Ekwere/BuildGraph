import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, PlusCircle, LayoutDashboard, Tag } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{ 
      borderBottom: '1px solid var(--border-subtle)', 
      background: 'rgba(11, 15, 25, 0.88)', 
      backdropFilter: 'blur(16px)', 
      position: 'sticky', 
      top: 0, 
      zIndex: 50 
    }}>
      <div className="navbar-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
        
        {/* Brand Header */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ 
            background: 'var(--primary-gradient)', 
            padding: '8px', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: 'var(--shadow-glow-cyan)' 
          }}>
            <Building2 size={20} color="#050b14" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.025em', color: '#fff', lineHeight: 1.2 }}>
              Build<span className="gradient-text">Graph</span>
            </div>
            <div className="brand-subtext" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span>CognoDB / Neo4j Engine</span>
            </div>
          </div>
        </Link>

         

        {/* Right Nav Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link 
            to="/" 
            className="btn-secondary" 
            style={{ 
              background: isActive('/') ? 'rgba(0, 242, 254, 0.08)' : 'transparent',
              borderColor: isActive('/') ? 'var(--primary)' : 'transparent',
              color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            <LayoutDashboard size={17} />
            <span className="nav-text-label">Dashboard</span>
          </Link>

          <Link 
            to="/materials" 
            className="btn-secondary" 
            style={{ 
              background: isActive('/materials') ? 'rgba(0, 242, 254, 0.08)' : 'transparent',
              borderColor: isActive('/materials') ? 'var(--primary)' : 'transparent',
              color: isActive('/materials') ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            <Tag size={17} />
            <span className="nav-text-label">Materials</span>
          </Link>
          
          <Link to="/new" className="btn-primary">
            <PlusCircle size={17} />
            <span className="nav-text-label">New Estimate</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
