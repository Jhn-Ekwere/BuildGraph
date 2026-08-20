import { executeCypher, getMockStore } from '../config/database.js';

export class CostRepository {
  async addActualCostRecord(data) {
    const cypher = `
      MATCH (l:Location {name: $location})
      MATCH (e:ConstructionElement {name: $element})
      MATCH (m:Material {name: $material})
      CREATE (c:CostRecord {
        id: $id,
        quantity: $quantity,
        unit: $unit,
        unitCost: $unitCost,
        totalAmount: $totalAmount,
        source: $source,
        date: date()
      })
      CREATE (c)-[:FOR_LOCATION]->(l)
      CREATE (c)-[:FOR_ELEMENT]->(e)
      CREATE (c)-[:USES_MATERIAL]->(m)
      RETURN c.id AS costRecordId
    `;

    const recordData = {
      id: `cost_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      location: data.location,
      element: data.element,
      material: data.material || 'General',
      quantity: parseFloat(data.quantity) || 1,
      unit: data.unit || 'unit',
      unitCost: parseFloat(data.actualUnitCost || data.actualTotal / (data.quantity || 1)),
      totalAmount: parseFloat(data.actualTotal),
      source: data.source || 'user_submitted'
    };

    // Update in-memory mock benchmarks as well for immediate data flywheel feedback
    const mockStore = getMockStore();
    if (mockStore.historicalCostBenchmarks[data.location]) {
      if (mockStore.historicalCostBenchmarks[data.location][data.element]) {
        mockStore.historicalCostBenchmarks[data.location][data.element][data.material] = recordData.unitCost;
      }
    }
    mockStore.costRecords.push(recordData);

    try {
      await executeCypher(cypher, recordData);
    } catch (err) {
      console.warn('Cypher cost insertion fallback:', err.message);
    }

    return recordData;
  }

  async getMaterialsByLocation(location = 'Lagos') {
    const cypher = `
      MATCH (c:CostRecord)-[:FOR_LOCATION]->(l:Location {name: $location}),
            (c)-[:FOR_ELEMENT]->(e:ConstructionElement),
            (c)-[:USES_MATERIAL]->(m:Material)
      RETURN
        e.name AS element,
        m.name AS material,
        m.unit AS unit,
        avg(c.unitCost) AS unitPrice,
        count(c) AS recordsCount,
        l.name AS location
      ORDER BY element, material
    `;

    try {
      const records = await executeCypher(cypher, { location });
      if (records && records.length > 0) {
        return records.map(r => ({
          element: r.element,
          material: r.material,
          unit: r.unit || 'unit',
          unitPrice: Math.round(Number(r.unitPrice)),
          recordsCount: Number(r.recordsCount || 1),
          location: r.location
        }));
      }
    } catch (err) {
      console.warn('Cypher materials lookup fallback:', err.message);
    }

    const mockStore = getMockStore();
    const locData = mockStore.historicalCostBenchmarks[location] || mockStore.historicalCostBenchmarks['Lagos'];
    const results = [];

    const unitMap = {
      'Cement': 'bags',
      'Blocks (9-inch)': 'pcs',
      'Sharp Sand': 'm³',
      'Granite (3/4")': 'm³',
      'High Yield Rebar (12mm/16mm)': 'tonnes',
      'Aluminum Roofing Sheet (0.55mm)': 'm²',
      'Hardwood Timber (2x3/2x4)': 'length',
      'Single Core Copper Wire (2.5mm²)': 'rolls',
      'PVC Pressure Pipes (4")': 'length',
      'Vitrified Floor Tiles (60x60cm)': 'm²',
      'Emulsion Paint (20L)': 'buckets',
      'General Labour': 'lump sum'
    };

    for (const [elementName, materials] of Object.entries(locData)) {
      for (const [materialName, unitPrice] of Object.entries(materials)) {
        results.push({
          element: elementName,
          material: materialName,
          unit: unitMap[materialName] || 'unit',
          unitPrice: Number(unitPrice),
          recordsCount: 27,
          location: location
        });
      }
    }

    return results;
  }
}
