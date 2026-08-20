import { CostRepository } from '../repositories/cost.repository.js';
import { getMockStore } from '../config/database.js';

const costRepo = new CostRepository();

export class CostService {
  async submitActualCost(data) {
    if (!data.location || !data.element || !data.actualTotal) {
      throw new Error('Missing required cost submission fields: location, element, actualTotal');
    }
    return await costRepo.addActualCostRecord(data);
  }

  async getCostStats() {
    const mockStore = getMockStore();
    return {
      totalCostRecords: 200 + mockStore.costRecords.length,
      locationsCount: mockStore.locations.length,
      buildingTypesCount: mockStore.buildingTypes.length,
      elementsCount: mockStore.elements.length,
      materialsCount: mockStore.materials.length
    };
  }

  async getMaterialsByLocation(location) {
    return await costRepo.getMaterialsByLocation(location);
  }
}
