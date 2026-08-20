// 5-HOP CYPHER TRAVERSAL QUERY (Showcase for Wexa Evaluation)
// Connects Project -> Location -> BuildingType -> ConstructionElement -> Material -> Historical CostRecords
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
ORDER BY element, material;
