import React, { useState } from 'react';
import { Search, Download, Layers, CheckCircle2 } from 'lucide-react';

export default function BOQTable({ items = [], totalCost = 0 }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val || 0);
  };

  // Get unique element categories for tabs
  const categories = ['ALL', ...new Set(items.map(i => i.element))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.element.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.material.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.element === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleExportCSV = () => {
    const headers = ['Construction Element', 'Material / Item', 'Quantity', 'Unit', 'Unit Rate (NGN)', 'Total Cost (NGN)'];
    const rows = filteredItems.map(i => [
      `"${i.element}"`,
      `"${i.material}"`,
      i.quantity,
      `"${i.unit}"`,
      i.unitCost,
      i.totalCost
    ]);
    
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BuildGraph_BOQ_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel" style={{ padding: '28px' }}>
      {/* Header & Export Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Layers size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Bill of Quantities (BOQ)</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Calculated quantity schedules cross-referenced with CognoDB 5-hop historical cost records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-control"
              style={{ paddingLeft: '38px', width: '220px', padding: '9px 12px 9px 38px', fontSize: '0.85rem' }}
            />
          </div>

          <button onClick={handleExportCSV} className="btn-secondary" style={{ padding: '9px 16px', fontSize: '0.85rem' }}>
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
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
            {cat === 'ALL' ? `All Items (${items.length})` : cat}
          </button>
        ))}
      </div>

      {/* Table Data View */}
      <div className="table-responsive-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Element Category</th>
              <th>Material / Item Description</th>
              <th>Estimated Quantity</th>
              <th>Graph Unit Rate</th>
              <th style={{ textAlign: 'right' }}>Total Cost (NGN)</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No materials match your search parameters.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.88rem' }}>
                    {item.element}
                  </td>
                  <td style={{ fontWeight: 500, color: '#fff' }}>
                    {item.material}
                  </td>
                  <td className="mono" style={{ color: 'var(--text-main)' }}>
                    {item.quantity.toLocaleString()} <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{item.unit}</span>
                  </td>
                  <td className="mono" style={{ color: 'var(--text-muted)' }}>
                    {formatCurrency(item.unitCost)}
                  </td>
                  <td className="mono" style={{ textAlign: 'right', fontWeight: 700, color: '#fff' }}>
                    {formatCurrency(item.totalCost)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr style={{ background: 'rgba(0, 242, 254, 0.04)' }}>
              <td colSpan={4} style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Summary Total Project BOQ
              </td>
              <td className="mono" style={{ textAlign: 'right', fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>
                {formatCurrency(totalCost)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
