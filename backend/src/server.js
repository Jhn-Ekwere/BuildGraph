import app from './app.js';
import { config } from './config/env.js';
import { initDriver } from './config/database.js';

const startServer = async () => {
  await initDriver();
  
  app.listen(config.port, () => {
    console.log(`🚀 Construction Estimator Backend running on port ${config.port}`);
    console.log(`📡 API Base URL: http://localhost:${config.port}/api`);
  });
};

startServer();
