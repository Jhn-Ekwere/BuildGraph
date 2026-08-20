import serverless from 'serverless-http';
import app from '../../backend/src/app.js';
import { initDriver } from '../../backend/src/config/database.js';

let initialized = false;
const expressApp = app && app.default ? app.default : app;

export const handler = async (event, context) => {
  if (!initialized) {
    await initDriver();
    initialized = true;
  }
  const handlerFn = serverless(expressApp);
  return await handlerFn(event, context);
};
