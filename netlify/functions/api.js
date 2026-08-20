import serverless from 'serverless-http';
import app from '../../backend/src/app.js';
import { initDriver } from '../../backend/src/config/database.js';

let initialized = false;

export const handler = async (event, context) => {
  if (!initialized) {
    await initDriver();
    initialized = true;
  }
  const handlerFn = serverless(app);
  return await handlerFn(event, context);
};
