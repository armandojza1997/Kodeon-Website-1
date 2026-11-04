import { GoogleGenAI } from '@google/genai';
import { generateSmartRoBotAnswer } from '../src/utils/roBotEngine';

const ROBOT_SYSTEM_INSTRUCTION = `Eres Ro-Bot, el asistente virtual y compañero robótico del portfolio profesional "TECNOVA" de un Desarrollador Web Senior y Diseñador Creativo.

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
1. Diseño y Desarrollo Web: $1,200 - $2,200 USD (10 a 14 días hábiles). Sitios corporativos y landing pages ultrarrápidas con SEO semántico y Core Web Vitals 95+.
2. Diseño UI/UX en Figma: $1,000 - $1,800 USD (7 a 10 días hábiles). Prototipos navegables, wireframes y sistemas de diseño modulares.
3. Aplicaciones Web a Medida & SaaS: $2,800 - $6,000+ USD (3 a 6 semanas). Plataformas en la nube, dashboards en tiempo real, roles RBAC y base de datos con React, TypeScript y Node.js.
4. E-commerce & Tiendas Online: $2,200 - $4,500 USD (2 a 4 semanas). Tiendas virtuales con pasarelas seguras (Stripe, PayPal), carrito en 1 clic y panel de pedidos.
5. Automatización & APIs: $1,500 - $3,500 USD (1 a 3 semanas). Conexión de CRMs, webhooks y microservicios.
6. Mantenimiento & Optimización: Planes desde $250/mes o auditoría puntual de rendimiento por $600 USD.

REGLAS DE RESPUESTA:
- Responde directamente y con precisión a lo que pregunta el usuario.
- Responde siempre en español fluido (o en el idioma del usuario).
- Sé conciso, claro y estructurado (1 a 3 párrafos breves).`;

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { messages, message } = req.body || {};

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
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const smart = generateSmartRoBotAnswer(userText);
      return res.status(200).json({
        success: true,
        reply: smart.reply,
        actionSuggestion: smart.actionSuggestion,
        source: 'local-engine'
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

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
      setTimeout(() => reject(new Error('Timeout Gemini')), 6500)
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

    return res.status(200).json({
      success: true,
      reply: replyText,
      source: 'gemini'
    });
  } catch (error: any) {
    const smart = generateSmartRoBotAnswer(userText);
    return res.status(200).json({
      success: true,
      reply: smart.reply,
      actionSuggestion: smart.actionSuggestion,
      source: 'local-engine-fallback'
    });
  }
}
