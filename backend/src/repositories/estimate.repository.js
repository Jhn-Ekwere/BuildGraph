import { executeCypher } from '../config/database.js';

export const FIVE_HOP_SHOWCASE_CYPHER = `
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
  count(c) AS recordsCount,
  l.name AS location,
  b.name AS buildingType
ORDER BY element, material
`;

export class EstimateRepository {
  /**
   * Retrieves historical unit cost benchmarks via 5-hop Cypher traversal query
   */
  async getHistoricalCosts(location, buildingType) {
    try {
      const records = await executeCypher(FIVE_HOP_SHOWCASE_CYPHER, {
        location,
        buildingType
      });
      return records;
    } catch (err) {
      console.error('Error in getHistoricalCosts:', err.message);
      return [];
    }
  }

  /**
   * Saves a generated estimate graph pattern
   */
  async saveEstimateGraph(estimateData) {
    const cypher = `
      CREATE (p:Project {
        id: $id,
        name: $name,
        landArea: $landArea,
        buildingArea: $buildingArea,
        quality: $quality,
        totalCost: $totalCost,
        confidence: $confidence,
        createdAt: datetime()
      })
      WITH p
      MERGE (l:Location {name: $location})
      MERGE (b:BuildingType {name: $buildingType})
      CREATE (p)-[:LOCATED_IN]->(l)
      CREATE (p)-[:HAS_TYPE]->(b)
      CREATE (boq:BOQ {id: 'boq_' + $id, totalAmount: $totalCost, itemCount: $itemCount})
      CREATE (p)-[:HAS_BOQ]->(boq)
      RETURN p.id AS projectId
    `;

    try {
      await executeCypher(cypher, {
        id: estimateData.id,
        name: estimateData.name,
        landArea: estimateData.landArea || 500,
        buildingArea: estimateData.buildingArea,
        quality: estimateData.quality,
        totalCost: estimateData.totalCost,
        confidence: estimateData.confidence,
        location: estimateData.location,
        buildingType: estimateData.buildingType,
        itemCount: estimateData.items.length
      });
      return estimateData.id;
    } catch (err) {
      console.warn('Saving to neo4j graph failed (using in-memory):', err.message);
      return estimateData.id;
    }
  }
}
