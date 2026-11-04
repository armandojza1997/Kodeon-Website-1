// Ro-Bot Comprehensive Knowledge Base and Conversational Engine
// Works seamlessly both Client-side (for offline/Vercel static resiliency) and Server-side (Gemini augmentation)

export interface RoBotAnswer {
  reply: string;
  actionSuggestion?: 'booking' | 'projects' | 'contact' | 'estimator';
}

export function generateSmartRoBotAnswer(userQuery: string): RoBotAnswer {
  const q = userQuery.trim().toLowerCase();

  // 1. Citas, reuniones, videollamadas
  if (
    q.includes('cita') ||
    q.includes('agenda') ||
    q.includes('reunion') ||
    q.includes('reunión') ||
    q.includes('llamada') ||
    q.includes('agendar') ||
    q.includes('calendario') ||
    q.includes('conversar') ||
    q.includes('hablar')
  ) {
    return {
      reply: `¡Excelente! *beep boop* 📅 Podemos coordinar una **videollamada de diagnóstico de 30 minutos** sin costo por Google Meet para revisar tu proyecto en detalle.

Puedes seleccionar tu fecha y horario preferido (10:00 AM, 11:30 AM, 02:30 PM, 04:00 PM, 05:30 PM) directamente pulsando el botón **"Agendar Cita"** aquí arriba o en el botón de abajo.`,
      actionSuggestion: 'booking'
    };
  }

  // 2. Apps móviles / PWA / Responsive
  if (
    q.includes('movil') ||
    q.includes('móvil') ||
    q.includes('celular') ||
    q.includes('android') ||
    q.includes('ios') ||
    q.includes('app ') ||
    q.includes('aplicacion movil') ||
    q.includes('aplicación móvil') ||
    q.includes('pwa')
  ) {
    return {
      reply: `Desarrollamos soluciones digitales **Mobile-First**:
• **Progressive Web Apps (PWAs):** Aplicaciones web instalables directamente en la pantalla de inicio del teléfono (Android e iOS) sin pasar por las tiendas, con funcionamiento offline, notificaciones y carga instantánea.
• **Diseño 100% Adaptativo:** Cada pantalla e interfaz se optimiza milimétricamente para pantallas táctiles de cualquier tamaño.
• **Integración Híbrida:** Si tu proyecto requiere publicación en App Store o Google Play, construimos la base con React/TypeScript y la empaquetamos con herramientas como Capacitor.

¿Tienes en mente una PWA para tus clientes o una app de uso interno?`,
      actionSuggestion: 'booking'
    };
  }

  // 3. Recomendaciones según caso del usuario
  if (
    q.includes('recomienda') ||
    q.includes('recomiendas') ||
    q.includes('consejo') ||
    q.includes('cual me conviene') ||
    q.includes('cuál me conviene') ||
    q.includes('que me conviene') ||
    q.includes('qué me conviene') ||
    q.includes('no se que necesito') ||
    q.includes('no sé qué necesito')
  ) {
    if (q.includes('startup') || q.includes('idea') || q.includes('validar') || q.includes('mvp')) {
      return {
        reply: `Para una startup o idea nueva, mi recomendación directa es desarrollar un **Sprint MVP o Landing Page de Alta Conversión** ($1,200 - $2,800 USD | 10-14 días).
• Te permite validar la propuesta de valor con usuarios reales rápidamente sin gastar decenas de miles de dólares.
• Incluye arquitectura React/Next.js escalable para que cuando recibas tracción, no tengas que rehacer el código desde cero.
• Analítica integrada para medir exactamente el interés de los usuarios.`,
        actionSuggestion: 'booking'
      };
    }
    if (q.includes('tienda') || q.includes('vender') || q.includes('producto') || q.includes('comercio') || q.includes('catalogo')) {
      return {
        reply: `Para vender productos te recomiendo nuestro servicio de **E-commerce de Alto Rendimiento** ($2,200 - $4,500 USD | 2-4 semanas):
• Pasarelas de pago seguras y sin fricción (Stripe, PayPal, MercadoPago o transferencias).
• Checkout rápido en 1 clic y carrito interactivo ultraligero.
• Panel administrativo fácil para gestionar pedidos, stock e inventario.
• Core Web Vitals 95+ para que Google posicione tus productos por encima de la competencia.`,
        actionSuggestion: 'booking'
      };
    }
    if (q.includes('lenta') || q.includes('antigua') || q.includes('vieja') || q.includes('rediseñ') || q.includes('actualizar') || q.includes('mejorar')) {
      return {
        reply: `Si ya tienes una web pero es lenta, anticuada o no genera conversiones, te recomiendo nuestra **Auditoría de Rendimiento & Rediseño UI/UX**:
• Evaluamos la experiencia del usuario (UX) y reestructuramos los flujos de conversión en Figma.
• Eliminamos código basura, dependencias obsoletas y optimizamos imágenes y assets.
• Logramos tiempos de carga inferiores a 1 segundo (<1s) y puntuación de 95+ en Google Lighthouse.`,
        actionSuggestion: 'booking'
      };
    }
    return {
      reply: `Para darte la recomendación técnica y comercial más precisa, analicemos 3 factores clave:
1. **Tu objetivo primordial:** ¿Es validar una idea, brindar presencia institucional a tu empresa, vender productos o automatizar procesos?
2. **Tu plazo de lanzamiento:** ¿Necesitas estar en línea en menos de 2 semanas o es un desarrollo de mediano plazo?
3. **Tu presupuesto aproximado:** ¿Buscas una solución esencial ($1,200 - $2,200) o un sistema SaaS avanzado ($2,800 - $6,000+)?

Cuéntame un poco más de tu negocio o agendemos una llamada de 30 min para asesorarte sin compromiso.`,
      actionSuggestion: 'booking'
    };
  }

  // 4. Catálogo y precios de servicios específicos
  if (
    q.includes('precio') ||
    q.includes('costo') ||
    q.includes('cuanto cuesta') ||
    q.includes('cuánto cuesta') ||
    q.includes('cuanto vale') ||
    q.includes('presupuesto') ||
    q.includes('tarifa') ||
    q.includes('cotizar')
  ) {
    return {
      reply: `Nuestros rangos de inversión son completamente transparentes:
• **Diseño y Desarrollo Web:** $1,200 – $2,200 USD (10 a 14 días hábiles)
• **Diseño UI/UX en Figma:** $1,000 – $1,800 USD (7 a 10 días hábiles)
• **Aplicaciones Web & SaaS:** $2,800 – $6,000+ USD (3 a 6 semanas)
• **E-commerce & Tiendas Online:** $2,200 – $4,500 USD (2 a 4 semanas)
• **Automatización & APIs:** $1,500 – $3,500 USD (1 a 3 semanas)
• **Mantenimiento & Soporte:** Planes desde $250 USD/mes o auditoría puntual de $600 USD.

Todos los proyectos se entregan con presupuesto cerrado y sin costes sorpresa. ¿Quieres cotizar un tipo específico de proyecto?`,
      actionSuggestion: 'estimator'
    };
  }

  // 5. Formas de pago, contratos y condiciones
  if (
    q.includes('pago') ||
    q.includes('metodo') ||
    q.includes('método') ||
    q.includes('forma de pago') ||
    q.includes('anticipo') ||
    q.includes('cuotas') ||
    q.includes('tarjeta') ||
    q.includes('factura')
  ) {
    return {
      reply: `Nuestras condiciones comerciales son claras y seguras:
• **Estructura 50 / 50:** Se abona un 50% de anticipo al inicio para reservar el sprint de trabajo, y el 50% restante al desplegar en producción una vez que estés 100% conforme.
• **Proyectos grandes (> $4,000 USD):** Se pueden dividir en 3 o 4 hitos pactados contra entregas demostrables en un entorno de staging privado.
• **Medios de pago aceptados:** Transferencias bancarias (nacionales e internacionales), tarjeta de crédito/débito vía Stripe y transferencias bancarias directas.
• **Facturación:** Se emite factura comercial por cada proyecto.`,
      actionSuggestion: 'contact'
    };
  }

  // 6. Garantías y soporte
  if (
    q.includes('garantia') ||
    q.includes('garantía') ||
    q.includes('soporte') ||
    q.includes('bug') ||
    q.includes('error') ||
    q.includes('fallo') ||
    q.includes('post-lanzamiento')
  ) {
    return {
      reply: `¡Tu inversión está 100% protegida!
• **Garantía total de 30 días:** Tras el despliegue del proyecto en producción, cuentas con 30 días de cobertura completa para resolver cualquier anomalía, bug o ajuste menor sin ningún coste extra.
• **Capacitación incluida:** Grabamos videos paso a paso explicando cómo gestionar tu plataforma o contenido para que no dependas de nadie.
• **Planes de mantenimiento opcionales:** Si deseas que nos encarguemos de backups diarios, actualizaciones de seguridad y monitoreo 24/7, ofrecemos planes continuos desde $250/mes.`,
      actionSuggestion: 'contact'
    };
  }

  // 7. Propiedad del código y derechos
  if (
    q.includes('codigo') ||
    q.includes('código') ||
    q.includes('propiedad') ||
    q.includes('repositorio') ||
    q.includes('derechos') ||
    q.includes('fuente') ||
    q.includes('github')
  ) {
    return {
      reply: `**El 100% del código y diseños son de tu exclusiva propiedad.**
Al liquidar el proyecto:
• Te transferimos la propiedad total de los repositorios en GitHub.
• Te entregamos los archivos fuente de Figma con todos los componentes y tipografías.
• Se configuran tus propias cuentas de hosting (Vercel, AWS, Cloudflare, etc.) para que tengas el control absoluto sin ataduras ni dependencias.`,
      actionSuggestion: 'contact'
    };
  }

  // 8. Tiempos de entrega y plazos
  if (
    q.includes('tiempo') ||
    q.includes('cuanto tarda') ||
    q.includes('cuánto tarda') ||
    q.includes('plazo') ||
    q.includes('demora') ||
    q.includes('duracion') ||
    q.includes('duración')
  ) {
    return {
      reply: `Nuestros tiempos de entrega son rigurosos y se pactan por contrato:
• **Landing pages y sitios web:** 10 a 14 días hábiles.
• **Prototipos UI/UX en Figma:** 7 a 10 días hábiles.
• **E-commerce completos:** 2 a 4 semanas.
• **Aplicaciones Web SaaS:** 3 a 6 semanas (divididas en sprints semanales).

Durante todo el proceso tendrás acceso a un enlace privado donde podrás ver el avance en tiempo real.`,
      actionSuggestion: 'booking'
    };
  }

  // 9. Stack tecnológico y herramientas
  if (
    q.includes('stack') ||
    q.includes('tecnologia') ||
    q.includes('tecnología') ||
    q.includes('lenguaje') ||
    q.includes('react') ||
    q.includes('next') ||
    q.includes('typescript') ||
    q.includes('node') ||
    q.includes('python') ||
    q.includes('tailwind')
  ) {
    return {
      reply: `Utilizamos exclusivamente tecnologías modernas, rápidas y escalables:
• **Frontend:** React 19, TypeScript, Next.js, Tailwind CSS v4 y Three.js / WebGL para efectos visuales interactivos.
• **Backend & APIs:** Node.js, Express, Python, endpoints REST y GraphQL.
• **Bases de Datos:** PostgreSQL, MySQL, MongoDB y Redis para caching.
• **Infraestructura & Cloud:** Docker, Git/GitHub, Vercel, Supabase, Cloud Run y AWS.
• **Diseño:** Figma profesional con Design Systems atómicos.

No utilizamos plantillas genéricas ni constructores visuales pesados que ralenticen tu web.`,
      actionSuggestion: 'projects'
    };
  }

  // 10. WordPress vs Código a medida
  if (q.includes('wordpress') || q.includes('elementor') || q.includes('wix') || q.includes('shopify') || q.includes('plantilla')) {
    return {
      reply: `En TECNOVA nos especializamos en **desarrollo moderno a medida con React, TypeScript y Next.js**:
• **Velocidad incomparable:** Las plantillas de WordPress y plugins suelen tardar de 4 a 8 segundos en cargar; nuestras webs a medida cargan en menos de 0.8 segundos.
• **Seguridad blindada:** Sin plugins vulnerables ni exploits frecuentes de CMS tradicionales.
• **Diseño 100% exclusivo:** Tu marca lucirá única y sofisticada, sin parecer una plantilla prehecha que usan miles de otros negocios.
• Si requieres autogestionar textos o blogs, conectamos un Headless CMS ultraligero y seguro.`,
      actionSuggestion: 'booking'
    };
  }

  // 11. Proyectos destacados y experiencia
  if (
    q.includes('proyecto') ||
    q.includes('portfolio') ||
    q.includes('portafolio') ||
    q.includes('trabajo') ||
    q.includes('ejemplo') ||
    q.includes('lumina') ||
    q.includes('chrono') ||
    q.includes('nexus') ||
    q.includes('experiencia')
  ) {
    return {
      reply: `En este portfolio puedes explorar varios proyectos representativos:
• **Lumina Analytics:** Dashboard SaaS para fintech con visualización de datos en tiempo real y arquitectura React/TypeScript.
• **Chrono Luxury:** Tienda de e-commerce de alta gama con checkout optimizado y experiencia visual minimalista.
• **Nexus AI Platform:** Interfaz conversacional y flujo de trabajo colaborativo para equipos de tecnología.
• **Hyperion 3D:** Experiencia digital inmersiva desarrollada con Three.js y shaders WebGL.

Puedes hacer clic en **"Ver Proyectos"** para desplazarte a la galería completa con fichas técnicas de cada uno.`,
      actionSuggestion: 'projects'
    };
  }

  // 12. SEO y Posicionamiento
  if (q.includes('seo') || q.includes('google') || q.includes('posicionamiento') || q.includes('visibilidad') || q.includes('trafico') || q.includes('tráfico')) {
    return {
      reply: `El SEO está integrado desde la primera línea de código:
• **Semántica HTML5 estricta:** Estructura jerárquica con encabezados (H1-H6) optimizados.
• **Core Web Vitals:** Rendimiento de 95-100 en Google PageSpeed, un factor oficial de ranking en Google.
• **Open Graph & Twitter Cards:** Previsualizaciones atractivas y profesionales al compartir tus enlaces en WhatsApp, LinkedIn y redes sociales.
• **Microdatos Schema.org (JSON-LD):** Metadatos estructurados para que los motores de búsqueda entiendan tu empresa y servicios.`,
      actionSuggestion: 'booking'
    };
  }

  // 13. Saludos cordiales o preguntas abiertas
  if (q.includes('hola') || q.includes('buenos dias') || q.includes('buenas tardes') || q.includes('que tal') || q.includes('qué tal')) {
    return {
      reply: `¡Hola! *beep boop* 🤖 Soy **Ro-Bot**, tu asistente cibernético en el portfolio de TECNOVA.

Estoy aquí para responder cualquier pregunta sobre:
1. **Nuestros 6 servicios de desarrollo web y diseño UI/UX** con presupuestos y plazos.
2. **Recomendaciones personalizadas** para tu negocio o idea.
3. **Condiciones comerciales**, metodología en 5 fases y garantía de 30 días.
4. **Agendar una videollamada de 30 minutos** directamente con el desarrollador.

¿Por dónde te gustaría empezar?`,
      actionSuggestion: 'booking'
    };
  }

  // 14. Fallback inteligente y contextual que responde la consulta
  return {
    reply: `Entiendo tu consulta sobre "${userQuery.replace(/[<>{}]/g, '')}". En TECNOVA diseñamos y desarrollamos soluciones digitales a medida (Sitios Web, Aplicaciones SaaS, E-commerce y Diseño UI/UX) priorizando código limpio, alto rendimiento y una estética minimalista premium.

¿Te gustaría que evaluemos tu requerimiento específico en una **videollamada de 30 minutos** sin costo, o prefieres que te comparta una estimación de inversión y plazos?`,
    actionSuggestion: 'booking'
  };
}
