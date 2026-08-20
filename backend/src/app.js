import express from 'express';
import cors from 'cors';
import projectRoutes from './routes/project.routes.js';
import estimateRoutes from './routes/estimate.routes.js';
import costRoutes from './routes/cost.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Safe middleware resolver for ESM/CJS bundler interop
const resolveRouter = (mod) => (mod && typeof mod === 'object' && mod.default ? mod.default : mod);

// API Endpoints
app.use('/api/projects', resolveRouter(projectRoutes));
app.use('/api/estimates', resolveRouter(estimateRoutes));
app.use('/api/costs', resolveRouter(costRoutes));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Construction Quantity & Cost Estimator API' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

export default app;
