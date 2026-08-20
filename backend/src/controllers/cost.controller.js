import { CostService } from '../services/cost.service.js';

const costService = new CostService();

export const submitActualCost = async (req, res) => {
  try {
    const record = await costService.submitActualCost(req.body);
    return res.status(201).json({
      success: true,
      message: 'Actual cost successfully submitted to historical graph dataset',
      data: record
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getCostStats = async (req, res) => {
  try {
    const stats = await costService.getCostStats();
    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMaterialsByLocation = async (req, res) => {
  try {
    const location = req.query.location || 'Lagos';
    const materials = await costService.getMaterialsByLocation(location);
    return res.json({
      success: true,
      location,
      count: materials.length,
      data: materials
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
