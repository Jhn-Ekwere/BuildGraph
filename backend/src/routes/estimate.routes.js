import { Router } from 'express';
import { createEstimate } from '../controllers/estimate.controller.js';

const router = Router();

router.post('/', createEstimate);

export default router;
