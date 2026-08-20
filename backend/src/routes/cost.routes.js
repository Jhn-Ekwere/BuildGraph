import { Router } from 'express';
import { submitActualCost, getCostStats, getMaterialsByLocation } from '../controllers/cost.controller.js';

const router = Router();

router.post('/', submitActualCost);
router.get('/stats', getCostStats);
router.get('/materials', getMaterialsByLocation);

export default router;
