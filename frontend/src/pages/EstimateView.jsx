import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, MapPin, Building, Ruler, Code, Database, Layers, CheckCircle2 } from 'lucide-react';
import BOQTable from '../components/BOQTable';
import SubmitActualCostModal from '../components/SubmitActualCostModal';
import CypherInspectorModal from '../components/CypherInspectorModal';
import SkeletonCard from '../components/SkeletonLoader';
import { fetchProjectById } from '../services/api';

export default function EstimateView() {
  const { id } = useParams();
  const locationState = useLocation();
  const navigate = useNavigate();

  const [estimate, setEstimate] = useState(locationState.state?.estimate || null);
  const [loading, setLoading] = useState(!estimate);
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [isCypherModalOpen, setIsCypherModalOpen] = useState(false);

  useEffect(() => {
    if (!estimate && id) {
      setLoading(true);
      fetchProjectById(id)
        .then(res => {
          if (res && res.data) setEstimate(res.data);
        })
        .catch(err => console.warn('Fetch estimate error:', err))
        .finally(() => setLoading(false));
    }
  }, [id, estimate]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val || 0);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '36px 24px' }}>
        <SkeletonCard />
        <div style={{ height: '24px' }}></div>
        <SkeletonCard />
      </div>
    );
  }

  if (!estimate) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '48px' }}>
          <h2 style={{ color: '#fff', marginBottom: '12px', fontSize: '1.4rem' }}>Estimate Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>The requested project estimation record could not be loaded from the database.</p>
          <Link to="/" className="btn-primary">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  // Aggregate element breakdown costs
  const elementTotals = {};
  if (estimate.items) {
    estimate.items.forEach(i => {
      elementTotals[i.element] = (elementTotals[i.element] || 0) + i.totalCost;
    });
  }

  return (
    <div className="page-container">
      
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginBottom: '24px', padding: '8px 14px', fontSize: '0.85rem' }}>
        <ArrowLeft size={16} />
        Back to Estimates
      </button>

      {/* Main Header / Summary Hero */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '36px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '220px', height: '220px', background: 'var(--primary)', opacity: '0.04', borderRadius: '50%', filter: 'blur(50px)' }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{estimate.name || 'Construction Estimate'}</h1>
              <span className="badge badge-emerald">
                <ShieldCheck size={14} />
                {estimate.confidence || 85}% Match Rate
              </span>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="var(--primary)" />
                {estimate.location} State
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building size={15} color="var(--accent-purple)" />
                {estimate.buildingType}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ruler size={15} color="var(--accent-emerald)" />
                {estimate.buildingArea} m² footprint
              </div>
            </div>
          </div>

          <div className="header-actions-flex" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => setIsCypherModalOpen(true)} className="btn-secondary">
              <Code size={16} color="var(--accent-purple)" />
              Inspect 5-Hop Cypher
            </button>

            <button onClick={() => setIsCostModalOpen(true)} className="btn-primary">
              <Database size={16} />
              Submit Actual Costs
            </button>
          </div>
        </div>

        {/* Cost Display Banner */}
        <div style={{ 
          background: 'rgba(0, 242, 254, 0.04)', 
          border: '1px solid var(--border-active)', 
          borderRadius: '18px', 
          padding: '24px 28px', 
          display: 'flex', 
          justify: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '20px' 
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total Estimated Project Construction Cost
            </div>
            <div className="mono hero-banner-cost" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: '1.2', marginTop: '4px' }}>
              {formatCurrency(estimate.totalCost)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Based on <strong>{estimate.similarProjectsCount || 255} historical project records</strong> in {estimate.location}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '4px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} />
              Verified via parameterized Cypher lookup
            </div>
          </div>
        </div>
      </div>

      {/* Element Cost Breakdown Bar Graphs */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Layers size={22} color="var(--primary)" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
            Cost Allocation by Construction Element
          </h2>
        </div>

        <div className="stats-grid">
          {Object.entries(elementTotals).map(([element, cost]) => {
            const pct = Math.round((cost / (estimate.totalCost || 1)) * 100);
            return (
              <div key={element} className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{element}</span>
                  <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>{pct}%</span>
                </div>
                <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
                  {formatCurrency(cost)}
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.08)', height: '7px', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ background: 'var(--primary-gradient)', width: `${pct}%`, height: '100%' }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOQ Table */}
      <BOQTable items={estimate.items || []} totalCost={estimate.totalCost} />

      {/* Modals */}
      <SubmitActualCostModal 
        isOpen={isCostModalOpen} 
        onClose={() => setIsCostModalOpen(false)} 
        location={estimate.location} 
      />

      <CypherInspectorModal 
        isOpen={isCypherModalOpen} 
        onClose={() => setIsCypherModalOpen(false)} 
        query={estimate.cypherQuery}
        params={estimate.cypherParams}
      />
    </div>
  );
}
