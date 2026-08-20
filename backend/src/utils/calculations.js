/**
 * Quantity & Cost Estimation Rules
 * Driven by Building Area (m²) and Quality Standard Multipliers
 */

export const QUALITY_MULTIPLIERS = {
  economy: 0.85,
  standard: 1.0,
  premium: 1.35
};

export const calculateQuantities = (buildingArea, quality = 'standard') => {
  const area = parseFloat(buildingArea) || 100;
  const qMult = QUALITY_MULTIPLIERS[quality.toLowerCase()] || 1.0;

  return [
    {
      element: 'Foundation',
      material: 'Cement',
      unit: 'bags',
      quantity: Math.ceil(area * 0.8 * qMult)
    },
    {
      element: 'Foundation',
      material: 'Sharp Sand',
      unit: 'm³',
      quantity: Math.ceil(area * 0.12 * qMult)
    },
    {
      element: 'Foundation',
      material: 'Granite (3/4")',
      unit: 'm³',
      quantity: Math.ceil(area * 0.08 * qMult)
    },
    {
      element: 'Blockwork',
      material: 'Blocks (9-inch)',
      unit: 'pcs',
      quantity: Math.ceil(area * 12.5)
    },
    {
      element: 'Blockwork',
      material: 'Cement',
      unit: 'bags',
      quantity: Math.ceil(area * 0.35 * qMult)
    },
    {
      element: 'Blockwork',
      material: 'Sharp Sand',
      unit: 'm³',
      quantity: Math.ceil(area * 0.05 * qMult)
    },
    {
      element: 'Concrete Work',
      material: 'Cement',
      unit: 'bags',
      quantity: Math.ceil(area * 0.6 * qMult)
    },
    {
      element: 'Concrete Work',
      material: 'Granite (3/4")',
      unit: 'm³',
      quantity: Math.ceil(area * 0.07 * qMult)
    },
    {
      element: 'Reinforcement',
      material: 'High Yield Rebar (12mm/16mm)',
      unit: 'tonnes',
      quantity: parseFloat((area * 0.015 * qMult).toFixed(2))
    },
    {
      element: 'Roofing',
      material: 'Aluminum Roofing Sheet (0.55mm)',
      unit: 'm²',
      quantity: Math.ceil(area * 1.25)
    },
    {
      element: 'Roofing',
      material: 'Hardwood Timber (2x3/2x4)',
      unit: 'length',
      quantity: Math.ceil(area * 0.95 * qMult)
    },
    {
      element: 'Plastering & Screeding',
      material: 'Cement',
      unit: 'bags',
      quantity: Math.ceil(area * 0.45 * qMult)
    },
    {
      element: 'Electrical Installation',
      material: 'Single Core Copper Wire (2.5mm²)',
      unit: 'rolls',
      quantity: Math.ceil(area * 0.08 * qMult)
    },
    {
      element: 'Plumbing Installation',
      material: 'PVC Pressure Pipes (4")',
      unit: 'length',
      quantity: Math.ceil(area * 0.12 * qMult)
    },
    {
      element: 'Finishing & Painting',
      material: 'Vitrified Floor Tiles (60x60cm)',
      unit: 'm²',
      quantity: Math.ceil(area * 1.1 * qMult)
    },
    {
      element: 'Finishing & Painting',
      material: 'Emulsion Paint (20L)',
      unit: 'buckets',
      quantity: Math.ceil(area * 0.06 * qMult)
    },
    {
      element: 'Labour & Supervision',
      material: 'General Labour',
      unit: 'lump sum',
      quantity: 1
    }
  ];
};
