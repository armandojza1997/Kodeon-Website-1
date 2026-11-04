import React, { useState } from 'react';
import { Layout, Palette, Terminal, ShoppingBag, Cpu, Wrench, ArrowUpRight, Check, X, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/soundFX';

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: React.ElementType;
  deliverables: string[];
  techUsed: string[];
  highlights: string;
}

export const Services: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const servicesData: ServiceItem[] = [
    {
      id: 'web-design-dev',
      number: '01',
      title: 'Diseño y desarrollo web',
      shortDesc: 'Sitios web modernos, responsive, optimizados y adaptados a la identidad de cada negocio.',
      fullDesc: 'Diseño y construyo sitios web institucionales, landing pages de alta conversión y experiencias digitales envolventes. Enfocado en velocidad de carga y rendimiento.',
      icon: Layout,
      deliverables: [
        'Diseño responsive a medida',
        'Maquetación semántica SEO-Friendly',
        'Animaciones e interacciones CSS/Motion',
        'Optimización Core Web Vitals 95+',
        'Integración con CMS'
      ],
      techUsed: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
      highlights: '100% Personalizado sin plantillas'
    },
    {
      id: 'ui-ux-design',
      number: '02',
      title: 'Diseño UI/UX',
      shortDesc: 'Interfaces intuitivas, atractivas y centradas en la experiencia del usuario.',
      fullDesc: 'Creación de design systems, prototipos interactivos en Figma, arquitectura de información y flujos orientados a reducir la fricción.',
      icon: Palette,
      deliverables: [
        'Investigación de usuarios y Wireframing',
        'Design Systems y componentes UI',
        'Prototipado interactivo de alta fidelidad',
        'Jerarquía tipográfica y color',
        'Accesibilidad WCAG'
      ],
      techUsed: ['Figma', 'Prototyping', 'Design Tokens'],
      highlights: 'Enfoque centrado en la usabilidad'
    },
    {
      id: 'web-applications',
      number: '03',
      title: 'Aplicaciones web',
      shortDesc: 'Plataformas, sistemas de gestión, dashboards y aplicaciones web personalizadas.',
      fullDesc: 'Construcción de Web Apps complejas, dashboards analíticos y plataformas SaaS con estado reactivo, gestión de usuarios y backend seguro.',
      icon: Terminal,
      deliverables: [
        'Arquitectura Frontend & Backend escalable',
        'Dashboards interactivos en tiempo real',
        'Autenticación segura y control de roles',
        'Consumo de APIs REST y GraphQL',
        'Bases de datos relacionales'
      ],
      techUsed: ['React', 'Node.js', 'Express', 'PostgreSQL'],
      highlights: 'Rendimiento y seguridad empresarial'
    },
    {
      id: 'ecommerce',
      number: '04',
      title: 'E-commerce',
      shortDesc: 'Tiendas online, integración de pasarelas de pago y soluciones comerciales digitales.',
      fullDesc: 'Desarrollo de experiencias de compra fluidas, optimizadas para móviles, integradas con pasarelas de pago y gestión de inventario.',
      icon: ShoppingBag,
      deliverables: [
        'Catálogos de productos interactivos',
        'Carrito y Checkout fluido',
        'Integración de Stripe y Paypal',
        'Panel de administración',
        'Optimización de conversión'
      ],
      techUsed: ['React', 'Stripe API', 'Shopify Headless', 'Tailwind CSS'],
      highlights: 'Checkouts rápidos sin abandonos'
    },
    {
      id: 'automation-integration',
      number: '05',
      title: 'Automatización e integración',
      shortDesc: 'Conexión de sistemas, integración de APIs y automatización de procesos empresariales.',
      fullDesc: 'Sincronización de datos entre CRMs, servicios Cloud, APIs de terceros (OpenAI, Google Workspace, Stripe) y flujos automatizados.',
      icon: Cpu,
      deliverables: [
        'Desarrollo de Webhooks y microservicios',
        'Integración con APIs de terceros',
        'Automatización de notificaciones',
        'Conexión de bases de datos',
        'Documentación técnica'
      ],
      techUsed: ['Node.js', 'REST APIs', 'Webhooks', 'Docker'],
      highlights: 'Reducción de trabajo manual'
    },
    {
      id: 'maintenance-optimization',
      number: '06',
      title: 'Mantenimiento y optimización',
      shortDesc: 'Mejoras de rendimiento, seguridad, posicionamiento SEO y mantenimiento técnico.',
      fullDesc: 'Servicio continuo de auditoría de código, optimización de velocidad de carga, parches de seguridad, actualización de dependencias y soporte.',
      icon: Wrench,
      deliverables: [
        'Auditoría técnica de rendimiento y SEO',
        'Refactorización de código legacy',
        'Monitoreo de disponibilidad',
        'Actualización de seguridad',
        'Soporte técnico directo'
      ],
      techUsed: ['Lighthouse', 'SEO Analytics', 'Security Auditing'],
      highlights: 'Disponibilidad 99.9% y velocidad'
    }
  ];

  return (
    <section id="services" className="relative py-24 bg-[#0b0e1b] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10152b] border border-white/10 text-xs font-mono text-[#EC9731] mb-3">
            <span>02. SERVICIOS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl text-balance mb-3">
            Servicios diseñados para elevar tu presencia digital.
          </h2>
          <p className="text-sm text-slate-400 max-w-lg text-balance">
            Soluciones integrales que combinan estética, ingeniería y enfoque estratégico.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                onMouseEnter={() => soundFX.playHover()}
                onClick={() => {
                  soundFX.playClick();
                  setSelectedService(service);
                }}
                className="group glass-panel glass-panel-hover p-7 rounded-2xl border border-white/10 flex flex-col justify-between cursor-pointer relative transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-extrabold font-mono text-[#EC9731]">
                      {service.number}
                    </span>
                    <div className="p-2.5 rounded-xl bg-[#314595]/30 text-[#EC9731] group-hover:bg-[#EC9731] group-hover:text-white transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#EC9731] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {service.shortDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{service.highlights}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#EC9731] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0b0e1b]/90 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/20 max-w-xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => {
                soundFX.playClick();
                setSelectedService(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#EC9731]/20 border border-[#EC9731]/40 text-[#EC9731]">
                {selectedService.number}
              </span>
              <span className="text-xs font-mono text-slate-400">DETALLES</span>
            </div>

            <h3 className="text-2xl font-extrabold text-white mb-3">
              {selectedService.title}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {selectedService.fullDesc}
            </p>

            <div className="mb-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#EC9731] font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Entregables Incluidos:
              </h4>
              <ul className="space-y-2">
                {selectedService.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setSelectedService(null);
                  const contactEl = document.getElementById('contact');
                  if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#EC9731] hover:bg-[#d88220] transition-colors cursor-pointer"
              >
                Solicitar Cotización
              </button>

              <button
                onClick={() => {
                  soundFX.playClick();
                  setSelectedService(null);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-white/5 transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
