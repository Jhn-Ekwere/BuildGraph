import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

let currentDirPath = '';
try {
  if (typeof import.meta !== 'undefined' && import.meta.url) {
    currentDirPath = path.dirname(fileURLToPath(import.meta.url));
  }
} catch (e) {
  currentDirPath = process.cwd();
}

if (currentDirPath) {
  dotenv.config({ path: path.resolve(currentDirPath, '../../.env') });
}
dotenv.config();

export const config = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  neo4j: {
    uri: process.env.NEO4J_URI || 'bolt://localhost:7687',
    user: process.env.NEO4J_USER || 'neo4j',
    password: process.env.NEO4J_PASSWORD || 'password'
  }
};
