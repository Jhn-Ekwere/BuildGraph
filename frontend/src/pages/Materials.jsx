import React, { useEffect, useState } from 'react';
import { MapPin, Search, Layers, Database, ShieldCheck, Tag, PlusCircle, ArrowUpRight, TrendingUp } from 'lucide-react';
import { fetchMaterialsByLocation } from '../services/api';
import SkeletonCard from '../components/SkeletonLoader';
import SubmitActualCostModal from '../components/SubmitActualCostModal';

export default function Materials() {
  const [location, setLocation] = useState('Lagos');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);

  const loadMaterials = async (locName) => {
    setLoading(true);
    try {
      const res = await fetchMaterialsByLocation(locName);
      if (res && res.data) {
        setMaterials(res.data);
      }
    } catch (err) {
      console.warn('Error loading materials:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials(location);
  }, [location]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val || 0);
  };

  const categories = ['ALL', ...new Set(materials.map(m => m.element))];

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.element.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || m.element === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const avgUnitPrice = materials.length > 0
    ? Math.round(materials.reduce((sum, m) => sum + (m.unitPrice || 0), 0) / materials.length)
    : 0;

  return (
    <div className="page-container">
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '5px 14px', borderRadius: '9999px', fontSize: '0.78rem', color: 'var(--accent-purple)', fontWeight: 700, marginBottom: '12px' }}>
            <Tag size={13} />
            <span>Regional Price Catalog</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: '1.2' }}>
            Material Rates by <span className="gradient-text">Location</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', marginTop: '6px', maxWidth: '620px' }}>
            Browse unit price benchmarks across Nigerian states derived from CognoDB historical project nodes.
          </p>
        </div>

        {/* Location Switcher Header Control */}
        <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MapPin size={18} color="var(--primary)" />
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Select State Benchmark
            </div>
            <select 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              className="input-control"
              style={{ padding: '6px 10px', fontSize: '0.92rem', border: 'none', background: 'transparent', fontWeight: 700, color: 'var(--primary)', cursor: 'pointer' }}
            >
              <option value="Lagos">Lagos State</option>
              <option value="Abuja">Abuja (FCT)</option>
              <option value="Port Harcourt">Port Harcourt (Rivers)</option>
              <option value="Ibadan">Ibadan (Oyo)</option>
              <option value="Benin City">Benin City (Edo)</option>
              <option value="Uyo">Uyo (Akwa Ibom)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="stats-grid">
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(0, 242, 254, 0.12)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
            <MapPin size={24} color="var(--primary)" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Active Location
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
              {location}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Layers size={24} color="var(--accent-emerald)" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Catalog Material Items
            </div>
            <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
              {materials.length} Materials
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.12)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <TrendingUp size={24} color="var(--accent-purple)" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Avg Catalog Rate
            </div>
            <div className="mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
              {formatCurrency(avgUnitPrice)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        
        {/* Table Search & Actions Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Material Benchmark Catalog</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Unit costs retrieved for <strong>{location}</strong> via parameterized Cypher traversals.
            </p>
          </div>

          <div className="filter-bar-flex" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Search material..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-control search-filter-box"
                style={{ paddingLeft: '38px', padding: '9px 12px 9px 38px', fontSize: '0.85rem' }}
              />
            </div>

            <button onClick={() => setIsCostModalOpen(true)} className="btn-primary">
              <PlusCircle size={16} />
              Contribute Rate
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.04)',
                color: selectedCategory === cat ? '#050b14' : 'var(--text-muted)',
                border: selectedCategory === cat ? 'none' : '1px solid var(--border-subtle)',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {cat === 'ALL' ? `All Categories (${materials.length})` : cat}
            </button>
          ))}
        </div>

        {/* Table View */}
        {loading ? (
          <div style={{ padding: '40px 0' }}>
            <SkeletonCard />
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            No materials match the selected search criteria.
          </div>
        ) : (
          <div className="table-responsive-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Material / Item Specification</th>
                  <th>Construction Element</th>
                  <th>Standard Unit</th>
                  <th>Location Unit Price (NGN)</th>
                  <th>Graph Confidence</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>
                      {item.material}
                    </td>
                    <td>
                      <span className="badge badge-purple">{item.element}</span>
                    </td>
                    <td className="mono" style={{ color: 'var(--text-muted)' }}>
                      per {item.unit}
                    </td>
                    <td className="mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td>
                      <span className="badge badge-emerald">
                        <ShieldCheck size={12} />
                        {item.recordsCount || 27}+ Records
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => setIsCostModalOpen(true)} 
                        className="btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        Submit Cost
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SubmitActualCostModal 
        isOpen={isCostModalOpen} 
        onClose={() => setIsCostModalOpen(false)} 
        location={location} 
      />
    </div>
  );
}
