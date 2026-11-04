import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory store for contact proposals
interface ProposalSubmission {
  id: string;
  name: string;
  email: string;
  company?: string;
  projectType: string;
  budget?: string;
  message: string;
  createdAt: string;
  status: 'recibido' | 'en_revision' | 'respondido';
}

const contactSubmissions: ProposalSubmission[] = [
  {
    id: 'prop-101',
    name: 'Elena Rostova',
    email: 'elena@cybertech.io',
    company: 'Cybertech Solutions',
    projectType: 'Aplicaciones Web',
    budget: '$5,000 - $10,000',
    message: 'Buscamos rediseñar nuestro dashboard SaaS con arquitectura moderna React y TypeScript.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'en_revision'
  }
];

// API Routes
app.post('/api/contact', (req, res) => {
  const { name, email, company, projectType, budget, message } = req.body;

  if (!name || !email || !projectType || !message) {
    return res.status(400).json({
      success: false,
      error: 'Por favor, completa todos los campos requeridos (Nombre, Email, Tipo de Proyecto y Mensaje).'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Por favor, introduce una dirección de correo electrónico válida.'
    });
  }

  const newSubmission: ProposalSubmission = {
    id: `prop-${Math.floor(1000 + Math.random() * 9000)}`,
    name: name.trim(),
    email: email.trim(),
    company: company ? company.trim() : undefined,
    projectType,
    budget,
    message: message.trim(),
    createdAt: new Date().toISOString(),
    status: 'recibido'
  };

  contactSubmissions.unshift(newSubmission);

  return res.json({
    success: true,
    message: '¡Propuesta recibida con éxito! Te responderé en un plazo máximo de 24 horas laborables.',
    proposalId: newSubmission.id,
    data: newSubmission
  });
});

app.get('/api/contact/submissions', (_req, res) => {
  return res.json({
    success: true,
    total: contactSubmissions.length,
    submissions: contactSubmissions
  });
});

// Interactive Project Cost Estimator endpoint
app.post('/api/estimate', (req, res) => {
  const { projectType, complexity, pages, features = [] } = req.body;

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

  return res.json({
    success: true,
    estimatedInvestment: `$${minPrice.toLocaleString('en-US')} - $${maxPrice.toLocaleString('en-US')}`,
    estimatedTimeline: `${estimatedDays} - ${estimatedDays + 5} días hábiles`,
    breakdown: {
      baseService: Math.round(basePrice),
      featuresCost: featureAddons,
      suggestedPhases: ['Discovery & Strategy', 'UI/UX Interactive Mockups', 'Core Architecture & Coding', 'QA & Launch Optimization']
    }
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const templatePath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
