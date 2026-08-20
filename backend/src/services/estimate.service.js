import { EstimateRepository, FIVE_HOP_SHOWCASE_CYPHER } from '../repositories/estimate.repository.js';
import { calculateQuantities } from '../utils/calculations.js';
import { getMockStore } from '../config/database.js';

const estimateRepo = new EstimateRepository();

export class EstimateService {
  async generateEstimate(input) {
    const {
      projectName = 'New Construction Project',
      location = 'Lagos',
      buildingType = '4 Bedroom Bungalow',
      landArea = 500,
      buildingArea = 220,
      quality = 'standard'
    } = input;

    // 1. Calculate material quantities using formula engine
    const calculatedItems = calculateQuantities(buildingArea, quality);

    // 2. Query historical unit costs from Neo4j/CognoDB via Cypher traversal
    let historicalData = await estimateRepo.getHistoricalCosts(location, buildingType);

    // 3. Fallback matching map from benchmark matrix
    const mockBenchmarks = getMockStore().historicalCostBenchmarks[location] || getMockStore().historicalCostBenchmarks['Lagos'];

    let totalProjectCost = 0;
    const processedItems = calculatedItems.map((item, index) => {
      // Find matching historical benchmark record
      let foundRecord = historicalData.find(
        h => h.element === item.element && h.material === item.material
      );

      let unitCost = 0;
      if (foundRecord && foundRecord.averageCost !== undefined && foundRecord.averageCost !== null) {
        unitCost = Math.round(Number(foundRecord.averageCost));
      } else if (mockBenchmarks[item.element] && mockBenchmarks[item.element][item.material]) {
        unitCost = Number(mockBenchmarks[item.element][item.material]);
      } else {
        // Fallback default pricing
        unitCost = item.element === 'Labour & Supervision' ? 2400000 : 12000;
      }

      // Labour is a lump sum
      const itemTotal = item.unit === 'lump sum' ? unitCost : Math.round(Number(item.quantity) * unitCost);
      totalProjectCost += itemTotal;

      return {
        id: `item_${index + 1}`,
        element: item.element,
        material: item.material,
        quantity: Number(item.quantity),
        unit: item.unit,
        unitCost: unitCost,
        totalCost: itemTotal
      };
    });

    // 4. Calculate Confidence Score based on historical record density
    const totalMatchingRecords = historicalData.reduce((acc, h) => acc + Number(h.recordsCount || 1), 0);
    const confidenceScore = Math.min(95, Math.max(65, 75 + Math.min(20, Math.floor(totalMatchingRecords / 3))));

    const estimateResult = {
      id: `proj_${Date.now()}`,
      name: projectName,
      location,
      buildingType,
      landArea: parseFloat(landArea),
      buildingArea: parseFloat(buildingArea),
      quality,
      totalCost: totalProjectCost,
      confidence: confidenceScore,
      similarProjectsCount: totalMatchingRecords || 27,
      createdAt: new Date().toISOString(),
      items: processedItems,
      cypherQuery: FIVE_HOP_SHOWCASE_CYPHER,
      cypherParams: { location, buildingType }
    };

    // Save to graph node store
    await estimateRepo.saveEstimateGraph(estimateResult);

    // Save to mock store for immediate listing in dashboard
    getMockStore().projects.unshift(estimateResult);

    return estimateResult;
  }
}
