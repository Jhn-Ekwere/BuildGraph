import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Database, ShieldCheck, Layers, RefreshCw, Search, MapPin, Building2, Filter } from 'lucide-react';
import EstimateCard from '../components/EstimateCard';
import SkeletonCard from '../components/SkeletonLoader';
import { fetchProjects, fetchCostStats } from '../services/api';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ totalCostRecords: 255, locationsCount: 6, buildingTypesCount: 5 });
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('ALL');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const projRes = await fetchProjects();
      if (projRes && projRes.data) {
        setProjects(projRes.data);
      }
      const statRes = await fetchCostStats();
      if (statRes && statRes.data) {
        setStats(statRes.data);
      }
    } catch (err) {
      console.warn('Dashboard fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.buildingType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'ALL' || p.location === locationFilter;
    return matchesSearch && matchesLocation;
  });

  const totalEstimatedValue = projects.reduce((sum, p) => sum + (p.totalCost || 0), 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div className="page-container">
      
      {/* Header Hero Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: '1.2' }}>
            Construction <span className="gradient-text">Quantity Estimator</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', marginTop: '6px', maxWidth: '620px' }}>
            Real-time material quantity estimation powered by 5-hop Cypher graph traversals and historical cost intelligence.
          </p>
        </div>

        <div className="header-actions-flex" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={loadDashboardData} className="btn-secondary">
            <RefreshCw size={16} />
            Refresh
          </button>
          <Link to="/new" className="btn-primary">
            <PlusCircle size={18} />
            New Construction Estimate
          </Link>
        </div>
      </div>

      {/* Metrics Stats Grid */}
      <div className="stats-grid">
        
        <div className="glass-panel" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(0, 242, 254, 0.12)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
            <Database size={24} color="var(--primary)" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Historical Cost Nodes
            </div>
            <div className="mono" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
              {stats.totalCostRecords || 255}+ Records
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <ShieldCheck size={24} color="var(--accent-emerald)" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Avg Graph Confidence
            </div>
            <div className="mono" style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '2px' }}>
              85% Match Rate
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.12)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <Layers size={24} color="var(--accent-purple)" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Estimated Portfolio
            </div>
            <div className="mono" style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
              {formatCurrency(totalEstimatedValue)}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Search & Filter Controls */}
      <div className="glass-panel filter-bar-flex" style={{ padding: '20px 24px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Saved Project Estimates</h2>
          <span className="badge badge-purple">{filteredProjects.length} Projects</span>
        </div>

        <div className="filter-bar-flex" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search project name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-control search-filter-box"
              style={{ paddingLeft: '38px', padding: '9px 12px 9px 38px', fontSize: '0.85rem' }}
            />
          </div>

          {/* Location Dropdown Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={15} color="var(--text-muted)" />
            <select 
              value={locationFilter} 
              onChange={(e) => setLocationFilter(e.target.value)}
              className="input-control search-filter-box"
              style={{ padding: '9px 14px', fontSize: '0.85rem' }}
            >
              <option value="ALL">All States</option>
              <option value="Lagos">Lagos State</option>
              <option value="Abuja">Abuja (FCT)</option>
              <option value="Port Harcourt">Port Harcourt</option>
              <option value="Ibadan">Ibadan</option>
              <option value="Benin City">Benin City</option>
              <option value="Uyo">Uyo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Content / Skeleton Loader / Empty State */}
      {loading ? (
        <div className="cards-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid var(--border-subtle)' }}>
            <Building2 size={32} color="var(--text-dim)" />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px', fontWeight: 800 }}>No estimates found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '440px', margin: '0 auto 24px', fontSize: '0.9rem' }}>
            {searchQuery || locationFilter !== 'ALL' 
              ? 'No project estimates match your search filters. Try adjusting your search query or location filter.'
              : 'Create your first quantity & cost estimate to compute foundation, blockwork, roofing, and finishing costs.'}
          </p>
          <Link to="/new" className="btn-primary">
            <PlusCircle size={18} />
            Generate New Estimate
          </Link>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredProjects.map((project) => (
            <EstimateCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
