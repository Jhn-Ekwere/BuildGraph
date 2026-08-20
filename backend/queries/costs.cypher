// Query 1: Query historical costs for an element in a location
MATCH (c:CostRecord)-[:FOR_LOCATION]->(l:Location),
      (c)-[:FOR_ELEMENT]->(e:ConstructionElement)
WHERE l.name = $location
  AND e.name = $element
RETURN
  e.name AS element,
  avg(c.unitCost) AS averageCost,
  count(c) AS recordsCount;

// Query 2: Data Flywheel Insertion Cypher
MATCH (l:Location {name: $location})
MATCH (e:ConstructionElement {name: $element})
MATCH (m:Material {name: $material})
CREATE (c:CostRecord {
  id: $id,
  quantity: $quantity,
  unit: $unit,
  unitCost: $unitCost,
  totalAmount: $totalAmount,
  source: 'user_contributed',
  date: date()
})
CREATE (c)-[:FOR_LOCATION]->(l)
CREATE (c)-[:FOR_ELEMENT]->(e)
CREATE (c)-[:USES_MATERIAL]->(m)
RETURN c;
