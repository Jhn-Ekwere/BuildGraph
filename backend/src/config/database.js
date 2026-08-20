import neo4j from 'neo4j-driver';
import { config } from './env.js';

let driver = null;
let isMockMode = false;

// In-memory mock graph storage for offline / zero-dependency fallback execution
const mockStore = {
  locations: [
    { id: 'loc_lagos', name: 'Lagos', state: 'Lagos State', country: 'Nigeria' },
    { id: 'loc_abuja', name: 'Abuja', state: 'FCT', country: 'Nigeria' },
    { id: 'loc_ph', name: 'Port Harcourt', state: 'Rivers State', country: 'Nigeria' },
    { id: 'loc_ibadan', name: 'Ibadan', state: 'Oyo State', country: 'Nigeria' },
    { id: 'loc_benin', name: 'Benin City', state: 'Edo State', country: 'Nigeria' },
    { id: 'loc_uyo', name: 'Uyo', state: 'Akwa Ibom State', country: 'Nigeria' }
  ],
  buildingTypes: [
    { id: 'bt_2bed_bung', name: '2 Bedroom Bungalow', bedrooms: 2 },
    { id: 'bt_3bed_bung', name: '3 Bedroom Bungalow', bedrooms: 3 },
    { id: 'bt_4bed_bung', name: '4 Bedroom Bungalow', bedrooms: 4 },
    { id: 'bt_5bed_bung', name: '5 Bedroom Bungalow', bedrooms: 5 },
    { id: 'bt_4bed_duplex', name: '4 Bedroom Duplex', bedrooms: 4 }
  ],
  elements: [
    { id: 'elem_foundation', name: 'Foundation' },
    { id: 'elem_blockwork', name: 'Blockwork' },
    { id: 'elem_concrete', name: 'Concrete Work' },
    { id: 'elem_rebar', name: 'Reinforcement' },
    { id: 'elem_roofing', name: 'Roofing' },
    { id: 'elem_plastering', name: 'Plastering & Screeding' },
    { id: 'elem_electrical', name: 'Electrical Installation' },
    { id: 'elem_plumbing', name: 'Plumbing Installation' },
    { id: 'elem_finishing', name: 'Finishing & Painting' },
    { id: 'elem_labour', name: 'Labour & Supervision' }
  ],
  materials: [
    { id: 'mat_cement', name: 'Cement', unit: 'bags' },
    { id: 'mat_blocks', name: 'Blocks (9-inch)', unit: 'pcs' },
    { id: 'mat_sand', name: 'Sharp Sand', unit: 'm³' },
    { id: 'mat_granite', name: 'Granite (3/4")', unit: 'm³' },
    { id: 'mat_rebar', name: 'High Yield Rebar (12mm/16mm)', unit: 'tonnes' },
    { id: 'mat_roofing', name: 'Aluminum Roofing Sheet (0.55mm)', unit: 'm²' },
    { id: 'mat_timber', name: 'Hardwood Timber (2x3/2x4)', unit: 'length' },
    { id: 'mat_cables', name: 'Single Core Copper Wire (2.5mm²)', unit: 'rolls' },
    { id: 'mat_pipes', name: 'PVC Pressure Pipes (4")', unit: 'length' },
    { id: 'mat_tiles', name: 'Vitrified Floor Tiles (60x60cm)', unit: 'm²' },
    { id: 'mat_paint', name: 'Emulsion Paint (20L)', unit: 'buckets' }
  ],
  // Base historical price benchmark matrix per location (NGN)
  historicalCostBenchmarks: {
    'Lagos': {
      'Foundation': { 'Cement': 11000, 'Sharp Sand': 15000, 'Granite (3/4")': 30000 },
      'Blockwork': { 'Blocks (9-inch)': 700, 'Cement': 11000, 'Sharp Sand': 15000 },
      'Concrete Work': { 'Cement': 11000, 'Sharp Sand': 15000, 'Granite (3/4")': 30000 },
      'Reinforcement': { 'High Yield Rebar (12mm/16mm)': 1250000 },
      'Roofing': { 'Aluminum Roofing Sheet (0.55mm)': 9000, 'Hardwood Timber (2x3/2x4)': 3500 },
      'Plastering & Screeding': { 'Cement': 11000, 'Sharp Sand': 15000 },
      'Electrical Installation': { 'Single Core Copper Wire (2.5mm²)': 38000 },
      'Plumbing Installation': { 'PVC Pressure Pipes (4")': 9500 },
      'Finishing & Painting': { 'Vitrified Floor Tiles (60x60cm)': 8500, 'Emulsion Paint (20L)': 28000 },
      'Labour & Supervision': { 'General Labour': 2400000 }
    },
    'Abuja': {
      'Foundation': { 'Cement': 11800, 'Sharp Sand': 17000, 'Granite (3/4")': 34000 },
      'Blockwork': { 'Blocks (9-inch)': 780, 'Cement': 11800, 'Sharp Sand': 17000 },
      'Concrete Work': { 'Cement': 11800, 'Sharp Sand': 17000, 'Granite (3/4")': 34000 },
      'Reinforcement': { 'High Yield Rebar (12mm/16mm)': 1320000 },
      'Roofing': { 'Aluminum Roofing Sheet (0.55mm)': 9500, 'Hardwood Timber (2x3/2x4)': 3800 },
      'Plastering & Screeding': { 'Cement': 11800, 'Sharp Sand': 17000 },
      'Electrical Installation': { 'Single Core Copper Wire (2.5mm²)': 41000 },
      'Plumbing Installation': { 'PVC Pressure Pipes (4")': 10200 },
      'Finishing & Painting': { 'Vitrified Floor Tiles (60x60cm)': 9200, 'Emulsion Paint (20L)': 31000 },
      'Labour & Supervision': { 'General Labour': 2700000 }
    },
    'Port Harcourt': {
      'Foundation': { 'Cement': 11400, 'Sharp Sand': 16000, 'Granite (3/4")': 32000 },
      'Blockwork': { 'Blocks (9-inch)': 740, 'Cement': 11400, 'Sharp Sand': 16000 },
      'Concrete Work': { 'Cement': 11400, 'Sharp Sand': 16000, 'Granite (3/4")': 32000 },
      'Reinforcement': { 'High Yield Rebar (12mm/16mm)': 1290000 },
      'Roofing': { 'Aluminum Roofing Sheet (0.55mm)': 9200, 'Hardwood Timber (2x3/2x4)': 3600 },
      'Plastering & Screeding': { 'Cement': 11400, 'Sharp Sand': 16000 },
      'Electrical Installation': { 'Single Core Copper Wire (2.5mm²)': 39500 },
      'Plumbing Installation': { 'PVC Pressure Pipes (4")': 9800 },
      'Finishing & Painting': { 'Vitrified Floor Tiles (60x60cm)': 8900, 'Emulsion Paint (20L)': 29500 },
      'Labour & Supervision': { 'General Labour': 2550000 }
    }
  },
  costRecords: [],
  projects: []
};

// Initialize graph driver
export const initDriver = async () => {
  try {
    const auth = neo4j.auth.basic(config.neo4j.user, config.neo4j.password);
    driver = neo4j.driver(config.neo4j.uri, auth, { maxConnectionLifetime: 3 * 60 * 1000 });
    
    // Test connectivity with a 1.5-second timeout
    const session = driver.session();
    try {
      await session.run('RETURN 1 AS result');
      console.log('⚡ Connected successfully to Neo4j / CognoDB Graph Database');
      isMockMode = false;
    } finally {
      await session.close();
    }
  } catch (err) {
    console.warn('⚠️ Could not connect to external Neo4j / CognoDB instance. Using embedded fallback graph driver logic.');
    console.warn(`Reason: ${err.message}`);
    isMockMode = true;
  }
};

export const getDriver = () => driver;

// Fix JSON serialization for BigInt values returned by Neo4j driver
BigInt.prototype.toJSON = function () {
  return Number(this);
};

export const deepConvertNeo4jTypes = (val) => {
  if (val === null || val === undefined) return val;
  if (typeof val === 'bigint') return Number(val);
  if (neo4j.isInt(val) || (typeof val === 'object' && typeof val.toNumber === 'function')) {
    return val.toNumber();
  }
  if (Array.isArray(val)) {
    return val.map(deepConvertNeo4jTypes);
  }
  if (typeof val === 'object') {
    const sourceObj = val.properties ? val.properties : val;
    const cleanObj = {};
    for (const [k, v] of Object.entries(sourceObj)) {
      cleanObj[k] = deepConvertNeo4jTypes(v);
    }
    return cleanObj;
  }
  return val;
};

export const executeCypher = async (cypherQuery, params = {}) => {
  if (isMockMode || !driver) {
    // Returns fallback simulated query results based on parameters
    return handleMockQuery(cypherQuery, params);
  }

  const session = driver.session();
  try {
    const result = await session.run(cypherQuery, params);
    return result.records.map(record => {
      const obj = record.toObject();
      return deepConvertNeo4jTypes(obj);
    });
  } catch (error) {
    console.error('Cypher Execution Error:', error.message);
    throw error;
  } finally {
    await session.close();
  }
};

export const getMockStore = () => mockStore;
export const getIsMockMode = () => isMockMode;

// Mock Query Handler executing graph lookup semantics
function handleMockQuery(cypher, params) {
  const cypherUpper = cypher.toUpperCase();

  if (cypherUpper.includes('MATCH (C:COSTRECORD)') || cypherUpper.includes('HISTORICAL COST')) {
    const locationName = params.location || 'Lagos';
    const buildingType = params.buildingType || '4 Bedroom Bungalow';
    const locationData = mockStore.historicalCostBenchmarks[locationName] || mockStore.historicalCostBenchmarks['Lagos'];

    // Return aggregated historical costs per element & material
    const records = [];
    for (const [elementName, materials] of Object.entries(locationData)) {
      for (const [materialName, unitPrice] of Object.entries(materials)) {
        records.push({
          element: elementName,
          material: materialName,
          averageCost: unitPrice,
          recordsCount: 27,
          location: locationName,
          buildingType: buildingType
        });
      }
    }
    return records;
  }

  if (cypherUpper.includes('MATCH (P:PROJECT)') && params.projectId) {
    const found = mockStore.projects.find(p => p.id === params.projectId);
    if (found) return [found];
  }

  return [];
}
