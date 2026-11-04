import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { generateSmartRoBotAnswer } from './src/utils/roBotEngine';

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

// Appointments store for scheduling discovery meetings directly in chat
export interface Appointment {
  id: string;
  name: string;
  email: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  serviceTopic: string;
  notes?: string;
  meetLink: string;
  status: 'confirmada' | 'reprogramada' | 'cancelada';
  createdAt: string;
}

const appointments: Appointment[] = [
  {
    id: 'CITA-1042',
    name: 'Carlos Mendoza',
    email: 'carlos@mendoza-law.com',
    date: '2026-11-10',
    time: '11:30 AM',
    serviceTopic: 'Diseño y Desarrollo Web',
    notes: 'Reunión de diagnóstico para renovación de plataforma web corporativa.',
    meetLink: 'https://meet.google.com/aur-xqp-782',
    status: 'confirmada',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

const ROBOT_SYSTEM_INSTRUCTION = `Eres Ro-Bot, el asistente virtual y compañero robótico del portfolio profesional "Códix" de un Desarrollador Web Senior y Diseñador Creativo.

Tu rol:
1. Brindar información detallada y transparente de TODOS nuestros productos, servicios y planes.
2. Analizar las necesidades del usuario y dar RECOMENDACIONES personalizadas sobre qué servicio, arquitectura o tecnología le conviene según su presupuesto y tipo de negocio.
3. Responder con precisión cualquier pregunta sobre el negocio (metodología, formas de pago, garantías, tiempos de entrega, propiedad del código, revisiones).
4. AGENDAR CITAS directamente mediante el chat (reuniones de descubrimiento de 30 min por videollamada de Google Meet).

Personalidad y tono:
- Eres el mismo robot del Hero (visor cibernético azul, antena iluminada de color naranja #EC9731 y chasis #10152b).
- Tono: Profesional, sofisticado, cálido, innovador, tecnológico y transparente. Puedes incluir toques robóticos sutiles (*beep boop*, *analizando parámetros*, *¡excelente elección!*).
- Formato claro y ordenado: utiliza viñetas, negritas y pasos numerados cuando facilite la lectura. Respuestas de 1 a 3 párrafos concisos.

CATÁLOGO DE PRODUCTOS Y SERVICIOS:
1. Diseño y Desarrollo Web:
   - Qué es: Sitios corporativos, landing pages de alta conversión y portales institucionales.
   - Entregables: Diseño responsive (móvil/tablet/desktop), semántica HTML5, Core Web Vitals 95+, SEO técnico inicial, panel autogestionable y analítica.
   - Duración típica: 10 - 14 días hábiles.
   - Inversión estimada: $1,200 - $2,200 USD.
2. Diseño UI/UX & Sistemas de Diseño:
   - Qué es: Prototipos navegables de alta fidelidad en Figma, wireframes, flujos de usuario y sistemas de diseño modulares con componentes reutilizables.
   - Entregables: Archivo Figma completo con variables de diseño, kit de componentes y prototipo interactivo para testear con clientes.
   - Duración típica: 7 - 10 días hábiles.
   - Inversión estimada: $1,000 - $1,800 USD.
3. Aplicaciones Web a Medida & SaaS:
   - Qué es: Plataformas en la nube, dashboards interactivos en tiempo real, sistemas de suscripción y portales de clientes con autenticación segura y roles (RBAC).
   - Stack: React, TypeScript, Node.js, Express, PostgreSQL/MongoDB, Tailwind CSS.
   - Duración típica: 3 - 6 semanas.
   - Inversión estimada: $2,800 - $6,000+ USD.
4. E-commerce & Tiendas Online de Alto Rendimiento:
   - Qué es: Tiendas virtuales optimizadas para conversión con pasarelas de pago seguras (Stripe, PayPal, transferencias), carrito reactivo en 1 clic y panel de inventario.
   - Entregables: Tienda completa, checkout sin fricción, notificaciones automáticas por email y panel de pedidos.
   - Duración típica: 2 - 4 semanas.
   - Inversión estimada: $2,200 - $4,500 USD.
5. Automatización de Procesos & APIs:
   - Qué es: Conexión entre sistemas, integración de APIs REST/GraphQL, webhooks, sincronización con CRMs (HubSpot, Salesforce, Notion) y automatización de flujos repetitivos.
   - Duración típica: 1 - 3 semanas.
   - Inversión estimada: $1,500 - $3,500 USD.
6. Mantenimiento, Optimización & Seguridad:
   - Qué es: Soporte continuo proactivo, auditoría de velocidad (< 1s carga), parches de seguridad, backups diarios y monitoreo 24/7.
   - Modalidades: Planes mensuales desde $250/mes o Auditoría puntual de rendimiento por $600 USD.

CÓMO DAR RECOMENDACIONES:
- Si el usuario dice "tengo una idea nueva / startup": Recomienda validar primero con una Landing Page estratégica o un MVP ágil en Aplicación Web.
- Si dice "vendo productos físicos o digitales": Recomienda E-commerce optimizado con Stripe para maximizar conversión.
- Si dice "ofrezco servicios profesionales (abogados, consultores, médicos, agencias)": Recomienda Sitio Web Corporativo con agendamiento automático de citas.
- Si dice "tengo procesos manuales en Excel o lentos": Recomienda Automatización e integración con APIs o un Dashboard personalizado.
- Si dice "ya tengo web pero es lenta o no vende": Recomienda Auditoría de Rendimiento & Rediseño UI/UX.

PREGUNTAS FRECUENTES DEL NEGOCIO:
- Metodología: Ágil en 5 fases (01. Discovery -> 02. Strategy & Design -> 03. Development -> 04. Testing & QA -> 05. Launch). Entregas incrementales semanales con acceso a entorno de staging.
- Formas de pago: 50% de anticipo para reservar sprint y 50% contra entrega y despliegue final en producción. Para proyectos mayores a $4,000 USD se puede pactar en 3 o 4 hitos. Pagos seguros mediante transferencia o tarjeta de crédito vía Stripe.
- Tiempos de entrega: Cumplimiento riguroso de calendarios pactados en el contrato.
- Garantía: 30 días de garantía total post-lanzamiento para soporte, corrección de bugs o ajustes menores sin coste.
- Propiedad intelectual: El 100% del código fuente, diseños en Figma y accesos pertenecen exclusivamente al cliente una vez liquidado el proyecto.

AGENDAMIENTO DE CITAS:
- Puedes invitar al usuario a agendar una videollamada de 30 minutos sin compromiso.
- El chat cuenta con un módulo interactivo de reservas de citas donde el usuario puede elegir día, hora (10:00 AM, 11:30 AM, 02:30 PM, 04:00 PM, 05:30 PM) e ingresar sus datos.
- Si el usuario te indica fecha, hora y datos en el mensaje, felicítalo y confírmale que puede concretarlo inmediatamente en la tarjeta de agendamiento del chat.`;

// Fallback response engine for local knowledge
function getFallbackRoBotResponse(userMsg: string): string {
  const lower = userMsg.toLowerCase();

  // 1. Agendamiento de citas
  if (lower.includes('cita') || lower.includes('agenda') || lower.includes('reunion') || lower.includes('llamada') || lower.includes('agendar') || lower.includes('calendario')) {
    return '¡Excelente iniciativa! *beep boop* 📅 Podemos coordinar una videollamada de descubrimiento de 30 minutos sin costo para analizar tu proyecto a fondo. Puedes pulsar el botón **"📅 Agendar Cita"** justo aquí arriba para seleccionar tu fecha, horario preferido y confirmar tu reserva de inmediato con enlace de Google Meet.';
  }

  // 2. Recomendaciones personalizadas
  if (lower.includes('recomienda') || lower.includes('que me recomiendas') || lower.includes('consejo') || lower.includes('cual me conviene') || lower.includes('no se que necesito') || lower.includes('idea')) {
    if (lower.includes('tienda') || lower.includes('vender') || lower.includes('producto')) {
      return 'Para venta de productos, mi recomendación directa es nuestro servicio de **E-commerce de Alto Rendimiento** ($2,200 - $4,500). Te incluye pasarela de pago instantánea con Stripe/PayPal, carrito en 1 clic y panel de control de inventario en 2 a 4 semanas. ¿Te gustaría agendar una llamada de 30 min para evaluar tus productos?';
    }
    if (lower.includes('lenta') || lower.includes('vieja') || lower.includes('actualizar') || lower.includes('rediseñ')) {
      return 'Si ya dispones de una web pero no convierte o carga lento, te recomiendo una **Auditoría de Rendimiento & Rediseño UI/UX**. Optimizamos Core Web Vitals a 95+ de puntuación y renovamos la arquitectura visual en Figma antes de programar para garantizar máxima conversión.';
    }
    return '¡Con gusto te asesoro! *analizando requerimientos* 🎯 Para darte la mejor recomendación: ¿Tu objetivo es validar una idea nueva, dar presencia institucional a tu negocio, vender productos online o automatizar un sistema interno? Cuéntame brevemente y te indicaré el servicio, stack y presupuesto ideal.';
  }

  // 3. Catálogo de productos y servicios
  if (lower.includes('servicio') || lower.includes('que haces') || lower.includes('haces') || lower.includes('ofreces') || lower.includes('catalogo') || lower.includes('producto')) {
    return `Disponemos de 6 servicios profesionales especializados:
• **01. Diseño y Desarrollo Web** ($1,200 - $2,200 | 10-14 días): Sitios corporativos y landing pages ultrarrápidas con SEO semántico.
• **02. Diseño UI/UX** ($1,000 - $1,800 | 7-10 días): Prototipos interactivos en Figma y design systems modulares.
• **03. Aplicaciones Web & SaaS** ($2,800 - $6,000+ | 3-6 semanas): Plataformas en la nube con dashboards en tiempo real, roles RBAC y base de datos.
• **04. E-commerce** ($2,200 - $4,500 | 2-4 semanas): Tiendas online con pasarelas seguras (Stripe, PayPal) y gestión de catálogo.
• **05. Automatización & APIs** ($1,500 - $3,500 | 1-3 semanas): Integración de CRMs, webhooks y optimización de procesos.
• **06. Mantenimiento & Optimización** (Desde $250/mes): Monitoreo 24/7, parches de seguridad y Core Web Vitals 95+.

¿Cuál de estos se adapta mejor a tu meta actual?`;
  }

  // 4. Preguntas sobre el negocio (Pagos, Garantías, Metodología)
  if (lower.includes('pago') || lower.includes('metodo') || lower.includes('forma de pago') || lower.includes('cuotas') || lower.includes('anticipo')) {
    return 'Nuestras condiciones comerciales son muy transparentes: trabajamos con un **50% de anticipo** para reservar el sprint de desarrollo y el **50% restante al desplegar en producción** tras tu aprobación final. Para proyectos grandes (> $4,000 USD), podemos dividirlo en 3 o 4 hitos. Aceptamos transferencias bancarias y tarjetas vía Stripe.';
  }

  if (lower.includes('garantia') || lower.includes('soporte') || lower.includes('mantenimiento') || lower.includes('fallo') || lower.includes('seguro')) {
    return '¡Total tranquilidad! Todos los proyectos incluyen **30 días de garantía total post-lanzamiento** sin costo alguno para corregir cualquier incidencia, realizar ajustes finos y brindarte videos de capacitación para que gestiones tu plataforma con total autonomía.';
  }

  if (lower.includes('tiempo') || lower.includes('cuanto tarda') || lower.includes('plazo') || lower.includes('demora') || lower.includes('duracion')) {
    return 'Los tiempos de entrega están estandarizados: Sitios web y landing pages toman entre **10 y 14 días hábiles**, diseño UI/UX en Figma de **7 a 10 días**, y aplicaciones web o tiendas online completas entre **2 y 5 semanas**. Cumplimos rigurosamente los cronogramas fijados en contrato.';
  }

  if (lower.includes('codigo') || lower.includes('propiedad') || lower.includes('repositorio') || lower.includes('derechos')) {
    return '¡El 100% del código y diseños son tuyos! Una vez liquidado el proyecto, te transferimos la totalidad de los repositorios en GitHub, accesos a servicios cloud y archivos fuente en Figma sin dependencias ni ataduras.';
  }

  if (lower.includes('precio') || lower.includes('cuanto') || lower.includes('costo') || lower.includes('presupuesto') || lower.includes('estimar')) {
    return 'Nuestras soluciones parten desde $1,000 para UI/UX o $1,200 para sitios web corporativos, hasta $2,800 - $6,000+ para plataformas SaaS avanzadas. También dispones de nuestro **Estimador de Costos Interactivo** en la sección de Contacto para calcular tu inversión en 3 clics.';
  }

  if (lower.includes('stack') || lower.includes('tecnologia') || lower.includes('react') || lower.includes('typescript')) {
    return 'Trabajamos con tecnologías punteras: **React, TypeScript, Tailwind CSS, Next.js y Three.js** en el frontend para interfaces visualmente extraordinarias, y **Node.js, Express, Python y PostgreSQL** en el backend para una arquitectura rápida, limpia y escalable.';
  }

  return `¡Hola! Soy Ro-Bot, asistente oficial de AURA. *beep boop* 🤖 Puedo informarte de todos nuestros servicios y precios, recomendarte la solución ideal para tu negocio, resolver dudas sobre contratos o agendar una cita de 30 min por Google Meet. ¿En qué te gustaría profundizar hoy?`;
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

// Appointments API Endpoints (Direct Chat Booking)
app.get('/api/appointments', (_req, res) => {
  return res.json({
    success: true,
    total: appointments.length,
    appointments
  });
});

app.get('/api/appointments/availability', (_req, res) => {
  const timeSlots = [
    '10:00 AM',
    '11:30 AM',
    '02:30 PM',
    '04:00 PM',
    '05:30 PM'
  ];

  // Generate next 10 business days starting tomorrow
  const availableDays: string[] = [];
  const current = new Date();
  let added = 0;
  while (added < 10) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    // Monday (1) to Friday (5)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      availableDays.push(current.toISOString().split('T')[0]);
      added++;
    }
  }

  return res.json({
    success: true,
    timeSlots,
    availableDays
  });
});

app.post('/api/appointments', (req, res) => {
  const { name, email, date, time, serviceTopic, notes } = req.body;

  if (!name || !email || !date || !time || !serviceTopic) {
    return res.status(400).json({
      success: false,
      error: 'Por favor, completa los campos requeridos: Nombre, Email, Fecha, Hora y Tema.'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Dirección de correo electrónico inválida.'
    });
  }

  // Generate unique Google Meet virtual link
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  const newAppointment: Appointment = {
    id: `CITA-${Math.floor(1000 + Math.random() * 9000)}`,
    name: name.trim(),
    email: email.trim(),
    date,
    time,
    serviceTopic,
    notes: notes ? String(notes).trim() : undefined,
    meetLink: `https://meet.google.com/aur-dev-${randomSuffix}`,
    status: 'confirmada',
    createdAt: new Date().toISOString()
  };

  appointments.unshift(newAppointment);

  return res.json({
    success: true,
    message: `¡Cita confirmada con éxito para el ${date} a las ${time}!`,
    appointment: newAppointment
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
      const smart = generateSmartRoBotAnswer(userText);
      return res.json({
        success: true,
        reply: smart.reply,
        actionSuggestion: smart.actionSuggestion,
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
    const replyText = response?.text || generateSmartRoBotAnswer(userText).reply;

    return res.json({
      success: true,
      reply: replyText,
      source: 'gemini'
    });
  } catch (error: any) {
    console.error('Error or timeout generating Ro-Bot response via Gemini:', error?.message || error);
    const smart = generateSmartRoBotAnswer(userText);
    return res.json({
      success: true,
      reply: smart.reply,
      actionSuggestion: smart.actionSuggestion,
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
