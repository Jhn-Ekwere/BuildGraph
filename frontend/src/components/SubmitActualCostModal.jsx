import React, { useState } from 'react';
import { X, Send, Database, CheckCircle } from 'lucide-react';
import { submitActualCost } from '../services/api';

export default function SubmitActualCostModal({ isOpen, onClose, location = 'Lagos' }) {
  const [element, setElement] = useState('Foundation');
  const [material, setMaterial] = useState('Cement');
  const [actualTotal, setActualTotal] = useState('');
  const [quantity, setQuantity] = useState('180');
  const [unit, setUnit] = useState('bags');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitActualCost({
        location,
        element,
        material,
        quantity: Number(quantity),
        unit,
        actualTotal: Number(actualTotal),
        source: 'user_contractor_submitted'
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      alert('Failed to submit cost record: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const calculatedUnitRate = actualTotal && quantity ? Math.round(Number(actualTotal) / Number(quantity)) : 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(0, 242, 254, 0.12)', padding: '10px', borderRadius: '12px' }}>
              <Database size={22} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Submit Actual Cost</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Power the graph data flywheel with real project pricing</p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '36px 0' }}>
            <CheckCircle size={52} color="var(--accent-emerald)" style={{ marginBottom: '16px' }} />
            <h4 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '8px', fontWeight: 800 }}>Graph Node Created!</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
              New <code className="mono" style={{ color: 'var(--primary)' }}>:CostRecord</code> node connected to <strong>{location}</strong> state graph network.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Target Location State</label>
              <input type="text" value={location} disabled className="input-control" style={{ color: 'var(--text-muted)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Construction Element</label>
                <select value={element} onChange={e => setElement(e.target.value)} className="input-control">
                  <option value="Foundation">Foundation</option>
                  <option value="Blockwork">Blockwork</option>
                  <option value="Concrete Work">Concrete Work</option>
                  <option value="Roofing">Roofing</option>
                  <option value="Plastering & Screeding">Plastering & Screeding</option>
                  <option value="Electrical Installation">Electrical Installation</option>
                  <option value="Plumbing Installation">Plumbing Installation</option>
                  <option value="Finishing & Painting">Finishing & Painting</option>
                  <option value="Labour & Supervision">Labour & Supervision</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Material / Item</label>
                <input type="text" value={material} onChange={e => setMaterial(e.target.value)} required className="input-control" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Quantity & Unit</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required className="input-control" style={{ width: '60%' }} />
                  <input type="text" value={unit} onChange={e => setUnit(e.target.value)} required className="input-control" style={{ width: '40%' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Actual Total Cost (NGN)</label>
                <input type="number" placeholder="e.g. 2350000" value={actualTotal} onChange={e => setActualTotal(e.target.value)} required className="input-control" />
              </div>
            </div>

            {calculatedUnitRate > 0 && (
              <div style={{ background: 'rgba(0, 242, 254, 0.05)', border: '1px solid var(--border-active)', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Derived Unit Rate:</span>
                <span className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>
                  ₦{calculatedUnitRate.toLocaleString()} / {unit}
                </span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary">
                <Send size={16} />
                {loading ? 'Inserting Node...' : 'Submit Actual Cost'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
