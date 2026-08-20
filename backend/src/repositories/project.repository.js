import { executeCypher, getMockStore, getIsMockMode } from '../config/database.js';

export class ProjectRepository {
  async getAllProjects() {
    const cypher = `
      MATCH (p:Project)-[:LOCATED_IN]->(l:Location),
            (p)-[:HAS_TYPE]->(b:BuildingType)
      RETURN p {
        .id,
        .name,
        .landArea,
        .buildingArea,
        .quality,
        .totalCost,
        .confidence,
        .createdAt,
        location: l.name,
        buildingType: b.name
      } AS project
      ORDER BY p.createdAt DESC
    `;

    try {
      if (getIsMockMode()) {
        return getMockStore().projects;
      }
      const records = await executeCypher(cypher);
      return records.map(r => r.project);
    } catch (err) {
      return getMockStore().projects;
    }
  }

  async getProjectById(id) {
    const cypher = `
      MATCH (p:Project {id: $id})-[:LOCATED_IN]->(l:Location),
            (p)-[:HAS_TYPE]->(b:BuildingType)
      RETURN p {
        .id,
        .name,
        .landArea,
        .buildingArea,
        .quality,
        .totalCost,
        .confidence,
        .createdAt,
        location: l.name,
        buildingType: b.name
      } AS project
    `;

    try {
      const records = await executeCypher(cypher, { id });
      if (records.length > 0) return records[0].project;
    } catch (err) {
      console.warn('Fallback to mock project lookup:', err.message);
    }
    return getMockStore().projects.find(p => p.id === id) || null;
  }
}
