import { EstimateService } from '../services/estimate.service.js';
import { z } from 'zod';

const estimateService = new EstimateService();

const createEstimateSchema = z.object({
  projectName: z.string().min(2).optional(),
  location: z.string(),
  buildingType: z.string(),
  landArea: z.number().optional(),
  buildingArea: z.number().positive(),
  quality: z.enum(['economy', 'standard', 'premium']).default('standard')
});

export const createEstimate = async (req, res) => {
  try {
    const validatedData = createEstimateSchema.parse({
      ...req.body,
      landArea: req.body.landArea ? Number(req.body.landArea) : 500,
      buildingArea: Number(req.body.buildingArea)
    });

    const result = await estimateService.generateEstimate(validatedData);
    return res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error creating estimate:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};
