// Query 1: Fetch Project Details with Location and Building Type
MATCH (p:Project)-[:LOCATED_IN]->(l:Location),
      (p)-[:HAS_TYPE]->(b:BuildingType)
WHERE p.id = $projectId
RETURN p, l, b;

// Query 2: Fetch all Projects
MATCH (p:Project)-[:LOCATED_IN]->(l:Location),
      (p)-[:HAS_TYPE]->(b:BuildingType)
RETURN p, l.name AS location, b.name AS buildingType
ORDER BY p.createdAt DESC;
