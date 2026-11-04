import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: geminiApiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const ROBOT_SYSTEM_INSTRUCTION = `Eres Ro-Bot, el asistente virtual y compañero robótico del portfolio profesional "AURA" de un Desarrollador Web Senior y Diseñador Creativo.

Tu personalidad:
- Eres el mismo robot carismático que se asoma en el Hero de la página (con visor cibernético, antena iluminada de color naranja #EC9731 y chasis azul #10152b).
- Hablas con tono profesional, sofisticado, cálido, innovador y tecnológico. Puedes incluir ocasionalmente guiños robóticos sutiles (*beep boop*, *analizando parámetros*, *¡manos a la obra!*).
- Te apasiona el código limpio, la arquitectura escalable, el diseño UI/UX minimalista y las experiencias web de alto impacto.

Conocimientos clave sobre AURA:
- Identidad de la marca: Exclusividad, sofisticación tecnológica, minimalismo y creatividad sin saturación visual. Colores: Azul principal (#314595), Azul profundo (#223488), Naranja de acento (#EC9731), Blanco (#FFFFFF).
- Servicios profesionales:
  1. Diseño y desarrollo web: Sitios web a medida, responsive, rápidos y optimizados.
  2. Diseño UI/UX: Interfaces intuitivas y sistemas de diseño en Figma.
  3. Aplicaciones web: Plataformas SaaS, dashboards interactivos y paneles de control.
  4. E-commerce: Tiendas online con pasarelas seguras (Stripe, PayPal) y gestión de catálogo.
  5. Automatización e integraciones: APIs REST/GraphQL, webhooks y optimización de flujos.
  6. Mantenimiento y optimización: Core Web Vitals, SEO técnico y seguridad.
- Tech Stack:
  - Frontend: HTML5, CSS3, JavaScript, TypeScript, React, Tailwind CSS, Three.js.
  - Backend: Node.js, Express, Python, PHP.
  - Bases de datos: PostgreSQL, MySQL, MongoDB.
  - Herramientas: Docker, Git/GitHub, Figma, Cloud Services.
- Metodología en 5 pasos: Discovery -> Strategy & Design -> Development -> Testing & Optimization -> Launch.
- Proyectos destacados: Lumina Dashboard (Fintech SaaS), Chrono Commerce (Luxury Store), Nexus AI (Plataforma IA), Astra UI (Sistema de diseño), Hyperion 3D (WebGL), Pulse Health (Telemedicina).
- Estimaciones y contacto: Existe un estimador de costos interactivo en la página y un formulario de contacto directo para agendar propuestas con respuesta en menos de 24 horas.

Reglas de respuesta:
- Responde siempre en español fluido (o en el idioma en que te escriba el usuario).
- Sé conciso, claro y directo: respuestas de 1 a 3 párrafos breves. Utiliza viñetas cuando faciliten la lectura.
- Si el usuario muestra interés en contratar o consultar un proyecto, anímalo a usar el formulario de contacto o el estimador interactivo de la página.
- Mantén siempre tu identidad como "Ro-Bot".`;

// Fallback response engine if API key is unconfigured or rate limited
function getFallbackRoBotResponse(userMsg: string): string {
  const lower = userMsg.toLowerCase();
  if (lower.includes('servicio') || lower.includes('que haces') || lower.includes('haces') || lower.includes('ofreces')) {
    return '¡Hola! *beep* Como Ro-Bot te cuento que aquí ofrecemos 6 servicios principales: 1) Diseño y Desarrollo Web, 2) Diseño UI/UX interactivo, 3) Aplicaciones Web & Dashboards SaaS, 4) E-commerce escalable, 5) Automatización e integración de APIs, y 6) Mantenimiento y optimización de rendimiento. ¿Tienes algún proyecto en mente?';
  }
  if (lower.includes('precio') || lower.includes('cuanto') || lower.includes('costo') || lower.includes('presupuesto') || lower.includes('estimar')) {
    return '¡Buena pregunta! *calculando módulos* Cada proyecto es único, pero en la sección de Contacto tenemos un Estimador Interactivo en tiempo real para calcular inversión y tiempos aproximados. Generalmente los proyectos oscilan entre $1,200 y $4,500+ según complejidad y características. ¡Pruébalo en la sección de contacto!';
  }
  if (lower.includes('stack') || lower.includes('tecnologia') || lower.includes('react') || lower.includes('typescript') || lower.includes('lenguaje')) {
    return 'Nuestro stack tecnológico principal está compuesto por: TypeScript, React, Next.js, Node.js, Tailwind CSS y Three.js para frontend moderno; y Node.js, Express, Python y PostgreSQL/MongoDB para arquitecturas backend robustas y seguras.';
  }
  if (lower.includes('proyecto') || lower.includes('portfolio') || lower.includes('trabajo') || lower.includes('experiencia')) {
    return 'En la sección "Selected Work" puedes explorar proyectos destacados como Lumina Dashboard (Fintech SaaS), Chrono Commerce (E-commerce de lujo) y Nexus AI Platform. Todos construidos con código limpio, alto rendimiento y diseño centrado en el usuario.';
  }
  if (lower.includes('contacto') || lower.includes('contratar') || lower.includes('hablar') || lower.includes('reunion') || lower.includes('email')) {
    return '¡Excelente! Puedes bajar a la sección de Contacto y enviar el formulario de propuesta, o escribirme tus detalles por aquí. Todos los mensajes se responden en menos de 24 horas laborables. ¡Hagamos realidad tu idea!';
  }
  return `¡Hola! Soy Ro-Bot, tu asistente inteligente en AURA. *beep boop* Estoy aquí para contarte todo sobre los servicios de desarrollo web, stack tecnológico, proyectos y cómo podemos colaborar juntos. ¿Qué te gustaría saber hoy?`;
}

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

// Ro-Bot AI Chatbot Endpoint (Powered by Gemini & Ro-Bot Persona)
app.post('/api/chat', async (req, res) => {
  const { messages, message } = req.body;

  let userText = '';
  if (typeof message === 'string') {
    userText = message.trim();
  } else if (Array.isArray(messages) && messages.length > 0) {
    const lastMsg = messages[messages.length - 1];
    userText = typeof lastMsg?.content === 'string' ? lastMsg.content.trim() : '';
  }

  if (!userText) {
    return res.status(400).json({
      success: false,
      error: 'Mensaje vacío. Por favor escribe algo para Ro-Bot.'
    });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY no detectado. Utilizando motor de respuestas inteligente Ro-Bot local.');
      const fallbackReply = getFallbackRoBotResponse(userText);
      return res.json({
        success: true,
        reply: fallbackReply,
        source: 'local-persona'
      });
    }

    // Prepare contents array for multi-turn Gemini 3.8 Flash
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    if (Array.isArray(messages) && messages.length > 1) {
      const recent = messages.slice(-9, -1);
      for (const m of recent) {
        if (m && m.content) {
          contents.push({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: String(m.content) }]
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: userText }]
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini call timeout')), 6500)
    );

    const apiPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: ROBOT_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const response: any = await Promise.race([apiPromise, timeoutPromise]);
    const replyText = response?.text || getFallbackRoBotResponse(userText);

    return res.json({
      success: true,
      reply: replyText,
      source: 'gemini'
    });
  } catch (error: any) {
    console.error('Error or timeout generating Ro-Bot response via Gemini:', error?.message || error);
    const fallbackReply = getFallbackRoBotResponse(userText);
    return res.json({
      success: true,
      reply: fallbackReply,
      source: 'local-persona-fallback'
    });
  }
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
