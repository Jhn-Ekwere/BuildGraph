import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building, Ruler, ArrowRight, ShieldCheck, Calendar } from 'lucide-react';

export default function EstimateCard({ project }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val || 0);
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Recent';
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="glass-panel glass-panel-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div>
        {/* Title & Confidence Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', gap: '12px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', lineHeight: '1.3' }}>{project.name}</h3>
          <span className="badge badge-emerald" style={{ flexShrink: 0 }}>
            <ShieldCheck size={13} />
            {project.confidence}% Match
          </span>
        </div>

        {/* Metadata Chips */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255, 255, 255, 0.03)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <MapPin size={13} color="var(--primary)" />
            {project.location}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255, 255, 255, 0.03)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <Building size={13} color="var(--accent-purple)" />
            {project.buildingType}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255, 255, 255, 0.03)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <Ruler size={13} color="var(--accent-emerald)" />
            {project.buildingArea} m²
          </div>
        </div>
      </div>

      {/* Footer Price & Action */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
            Estimated Cost
          </div>
          <div className="mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
            {formatCurrency(project.totalCost)}
          </div>
        </div>

        <Link to={`/estimate/${project.id}`} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
          Details
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
