export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { projectType, complexity, pages, features = [] } = req.body || {};

    let basePrice = 1200;
    let estimatedDays = 10;

    switch (projectType) {
      case 'Web Design':
        basePrice = 1200;
        estimatedDays = 10;
        break;
      case 'Web Development':
        basePrice = 1800;
        estimatedDays = 14;
        break;
      case 'Applications':
        basePrice = 3200;
        estimatedDays = 25;
        break;
      case 'E-commerce':
        basePrice = 2800;
        estimatedDays = 21;
        break;
      case 'Custom Solutions':
        basePrice = 3800;
        estimatedDays = 30;
        break;
      default:
        basePrice = 1500;
        estimatedDays = 14;
    }

    const compMult = complexity === 'alta' ? 1.5 : complexity === 'media' ? 1.2 : 1.0;
    basePrice *= compMult;
    estimatedDays = Math.round(estimatedDays * compMult);

    const extraPages = Math.max(0, (pages || 1) - 3);
    basePrice += extraPages * 150;
    estimatedDays += Math.ceil(extraPages * 1.5);

    let featureAddons = 0;
    if (Array.isArray(features)) {
      if (features.includes('auth')) { featureAddons += 400; estimatedDays += 2; }
      if (features.includes('payment')) { featureAddons += 500; estimatedDays += 3; }
      if (features.includes('cms')) { featureAddons += 450; estimatedDays += 3; }
      if (features.includes('multilingual')) { featureAddons += 350; estimatedDays += 2; }
      if (features.includes('animations')) { featureAddons += 400; estimatedDays += 3; }
      if (features.includes('seo_pro')) { featureAddons += 300; estimatedDays += 1; }
    }

    const minPrice = Math.round((basePrice + featureAddons) * 0.9);
    const maxPrice = Math.round((basePrice + featureAddons) * 1.15);

    return res.status(200).json({
      success: true,
      estimatedInvestment: `$${minPrice.toLocaleString('en-US')} - $${maxPrice.toLocaleString('en-US')}`,
      estimatedTimeline: `${estimatedDays} - ${estimatedDays + 5} días hábiles`,
      breakdown: {
        baseService: Math.round(basePrice),
        featuresCost: featureAddons,
        suggestedPhases: ['Discovery & Strategy', 'UI/UX Interactive Mockups', 'Core Architecture & Coding', 'QA & Launch Optimization']
      }
    });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
