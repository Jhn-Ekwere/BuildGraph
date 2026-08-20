import React, { useState } from 'react';
import { X, Code, Copy, Check, GitCommit, Layers } from 'lucide-react';

export default function CypherInspectorModal({ isOpen, onClose, query, params }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('cypher');

  if (!isOpen) return null;

  const defaultQuery = query || `
MATCH (p:Project)-[:LOCATED_IN]->(l:Location),
      (p)-[:HAS_TYPE]->(b:BuildingType),
      (p)-[:HAS_ELEMENT]->(e:ConstructionElement),
      (e)-[:USES_MATERIAL]->(m:Material),
      (c:CostRecord)-[:FOR_ELEMENT]->(e),
      (c)-[:FOR_LOCATION]->(l)
WHERE l.name = $location
  AND b.name = $buildingType
RETURN
  e.name AS element,
  m.name AS material,
  avg(c.unitCost) AS averageCost,
  count(c) AS recordsCount
ORDER BY element, material;
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(defaultQuery.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '750px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '10px', borderRadius: '12px' }}>
              <Code size={22} color="var(--accent-purple)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Cypher Multi-Hop Traversal Showcase</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Graph database query executed against CognoDB / Neo4j</p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Tab Bar */}
        <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
          <button className={`tab-btn ${activeTab === 'cypher' ? 'active' : ''}`} onClick={() => setActiveTab('cypher')}>
            Cypher Query (5-Hop)
          </button>
          <button className={`tab-btn ${activeTab === 'params' ? 'active' : ''}`} onClick={() => setActiveTab('params')}>
            Query Parameters
          </button>
          <button className={`tab-btn ${activeTab === 'explanation' ? 'active' : ''}`} onClick={() => setActiveTab('explanation')}>
            Graph Traversal Path
          </button>
        </div>

        {/* Tab 1: Cypher Code View */}
        {activeTab === 'cypher' && (
          <div style={{ background: '#070a12', borderRadius: '14px', border: '1px solid var(--border-subtle)', padding: '20px', position: 'relative' }}>
            <button 
              onClick={handleCopy} 
              className="btn-secondary" 
              style={{ position: 'absolute', top: '14px', right: '14px', padding: '6px 12px', fontSize: '0.75rem' }}
            >
              {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>

            <pre className="mono" style={{ fontSize: '0.86rem', color: '#38bdf8', overflowX: 'auto', lineHeight: '1.6' }}>
              {defaultQuery.trim()}
            </pre>
          </div>
        )}

        {/* Tab 2: Query Parameters */}
        {activeTab === 'params' && (
          <div style={{ background: '#070a12', borderRadius: '14px', border: '1px solid var(--border-subtle)', padding: '20px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
              Parameterized Cypher Inputs
            </div>
            <pre className="mono" style={{ fontSize: '0.9rem', color: 'var(--accent-amber)' }}>
              {JSON.stringify(params || { location: 'Lagos', buildingType: '4 Bedroom Bungalow' }, null, 2)}
            </pre>
          </div>
        )}

        {/* Tab 3: Graph Traversal Steps */}
        {activeTab === 'explanation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { hop: 'Hop 1', step: 'Project → Location', desc: 'Finds projects in target state node (e.g. Lagos)' },
              { hop: 'Hop 2', step: 'Project → BuildingType', desc: 'Filters by structural classification node (e.g. 4 Bedroom Bungalow)' },
              { hop: 'Hop 3', step: 'Project → ConstructionElement', desc: 'Traverses connected elements (Foundation, Blockwork, Roofing)' },
              { hop: 'Hop 4', step: 'ConstructionElement → Material', desc: 'Resolves exact required construction material specifications' },
              { hop: 'Hop 5', step: 'CostRecord → Location & Element', desc: 'Aggregates historical pricing from verified past project nodes' }
            ].map((h, i) => (
              <div key={i} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span className="badge badge-purple" style={{ flexShrink: 0 }}>{h.hop}</span>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{h.step}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-secondary">Close Inspector</button>
        </div>
      </div>
    </div>
  );
}
