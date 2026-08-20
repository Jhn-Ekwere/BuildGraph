import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton" style={{ width: '60%', height: '22px', borderRadius: '6px' }}></div>
        <div className="skeleton" style={{ width: '80px', height: '20px', borderRadius: '12px' }}></div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <div className="skeleton" style={{ width: '30%', height: '16px', borderRadius: '4px' }}></div>
        <div className="skeleton" style={{ width: '35%', height: '16px', borderRadius: '4px' }}></div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="skeleton" style={{ width: '80px', height: '12px', marginBottom: '8px' }}></div>
          <div className="skeleton" style={{ width: '130px', height: '26px' }}></div>
        </div>
        <div className="skeleton" style={{ width: '100px', height: '36px', borderRadius: '8px' }}></div>
      </div>
    </div>
  );
}
