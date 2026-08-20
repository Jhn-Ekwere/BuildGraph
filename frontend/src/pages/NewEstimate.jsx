import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, MapPin, Building, Ruler, ArrowLeft, Layers, ShieldCheck, Check } from 'lucide-react';
import { createEstimate } from '../services/api';

export default function NewEstimate() {
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState('My 4 Bedroom Bungalow');
  const [location, setLocation] = useState('Lagos');
  const [buildingType, setBuildingType] = useState('4 Bedroom Bungalow');
  const [landArea, setLandArea] = useState(500);
  const [buildingArea, setBuildingArea] = useState(220);
  const [quality, setQuality] = useState('standard');

  const [loading, setLoading] = useState(false);

  // Quick live calculated footprint preview
  const previewCementBags = Math.ceil(buildingArea * 1.6 * (quality === 'premium' ? 1.35 : quality === 'economy' ? 0.85 : 1.0));
  const previewBlocks = Math.ceil(buildingArea * 12.5);
  const previewRoofingArea = Math.ceil(buildingArea * 1.25);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createEstimate({
        projectName,
        location,
        buildingType,
        landArea: Number(landArea),
        buildingArea: Number(buildingArea),
        quality
      });

      if (response && response.data) {
        navigate(`/estimate/${response.data.id}`, { state: { estimate: response.data } });
      }
    } catch (err) {
      alert('Error creating estimate: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 24px' }}>
      <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginBottom: '24px', padding: '8px 14px', fontSize: '0.85rem' }}>
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      <div className="grid-two-col-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
        
        {/* Main Form Section */}
        <div className="glass-panel" style={{ padding: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px' }}>
            <div style={{ background: 'var(--primary-gradient)', padding: '12px', borderRadius: '14px', boxShadow: 'var(--shadow-glow-cyan)' }}>
              <Calculator size={26} color="#050b14" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>New Construction Estimate</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Specify project dimensions to run CognoDB 5-hop graph historical cost calculation
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Step 1: Project Basic Details */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                1. Project Name / Identifier
              </label>
              <input 
                type="text" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
                className="input-control"
                placeholder="e.g. Lagos Bungalow Project"
              />
            </div>

            {/* Step 2: Location & Building Type */}
            <div className="form-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <MapPin size={15} color="var(--primary)" />
                  Location State
                </label>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="input-control">
                  <option value="Lagos">Lagos State</option>
                  <option value="Abuja">Abuja (FCT)</option>
                  <option value="Port Harcourt">Port Harcourt (Rivers)</option>
                  <option value="Ibadan">Ibadan (Oyo)</option>
                  <option value="Benin City">Benin City (Edo)</option>
                  <option value="Uyo">Uyo (Akwa Ibom)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <Building size={15} color="var(--accent-purple)" />
                  Building Type
                </label>
                <select value={buildingType} onChange={(e) => setBuildingType(e.target.value)} className="input-control">
                  <option value="2 Bedroom Bungalow">2 Bedroom Bungalow</option>
                  <option value="3 Bedroom Bungalow">3 Bedroom Bungalow</option>
                  <option value="4 Bedroom Bungalow">4 Bedroom Bungalow</option>
                  <option value="5 Bedroom Bungalow">5 Bedroom Bungalow</option>
                  <option value="4 Bedroom Duplex">4 Bedroom Duplex</option>
                </select>
              </div>
            </div>

            {/* Step 3: Dimensions */}
            <div className="form-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <Ruler size={15} color="var(--accent-amber)" />
                  Plot Land Area (m²)
                </label>
                <input 
                  type="number" 
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  required
                  className="input-control"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <Ruler size={15} color="var(--accent-emerald)" />
                  Building Footprint (m²)
                </label>
                <input 
                  type="number" 
                  value={buildingArea}
                  onChange={(e) => setBuildingArea(e.target.value)}
                  required
                  className="input-control"
                />
              </div>
            </div>

            {/* Step 4: Quality Cards */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', display: 'block', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                4. Quality Specification Level
              </label>
              <div className="quality-selector-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {[
                  { id: 'economy', label: 'Economy', desc: 'Standard local specifications' },
                  { id: 'standard', label: 'Standard', desc: 'High-grade standard materials' },
                  { id: 'premium', label: 'Premium', desc: 'Luxury fittings & high specs' }
                ].map((q) => (
                  <div 
                    key={q.id}
                    onClick={() => setQuality(q.id)}
                    style={{
                      border: quality === q.id ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      background: quality === q.id ? 'rgba(0, 242, 254, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '14px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    {quality === q.id && (
                      <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--primary)', borderRadius: '50%', padding: '2px', display: 'flex' }}>
                        <Check size={12} color="#050b14" />
                      </div>
                    )}
                    <div style={{ fontWeight: 800, color: quality === q.id ? 'var(--primary)' : '#fff', marginBottom: '4px', fontSize: '0.95rem' }}>
                      {q.label}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {q.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Action Button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary" 
              style={{ width: '100%', padding: '16px', justifyContent: 'center', fontSize: '1rem', marginTop: '12px' }}
            >
              <Calculator size={20} />
              {loading ? 'Traversing 5-Hop Cypher Cost Graph...' : 'Calculate Graph Cost Estimate'}
            </button>
          </form>
        </div>

        {/* Right Sidebar: Real-time Quantity Footprint Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <Layers size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Live Footprint Preview</h3>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Real-time quantity estimates based on {buildingArea} m² building area.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Est. Total Cement
                </div>
                <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
                  ~{previewCementBags.toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>bags</span>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Est. 9-inch Blocks
                </div>
                <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-purple)', marginTop: '2px' }}>
                  ~{previewBlocks.toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>pcs</span>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Est. Roofing Sheets
                </div>
                <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '2px' }}>
                  ~{previewRoofingArea.toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>m²</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', background: 'rgba(0, 242, 254, 0.05)', border: '1px solid var(--border-active)', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--primary)' }}>
              <ShieldCheck size={16} />
              <span>CognoDB parameterized Cypher lookup ready</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
