import React, { useState } from 'react';
import { Search, Compass, Code, CheckCircle, Rocket, ArrowRight } from 'lucide-react';
import { soundFX } from '../utils/soundFX';

interface ProcessStage {
  number: string;
  title: string;
  shortDesc: string;
  details: string;
  deliverables: string[];
  icon: React.ElementType;
}

export const Process: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const stages: ProcessStage[] = [
    {
      number: '01',
      title: 'Discovery',
      shortDesc: 'Conocer las necesidades, objetivos y visión del cliente.',
      details: 'Reunión inicial para comprender la visión del producto, investigar audiencia objetivo, analizar competencia y definir el alcance técnico del proyecto.',
      deliverables: [
        'Análisis de requerimientos técnicos',
        'Definición de KPIs y metas de negocio',
        'Brief y arquitectura preliminar',
        'Cronograma estimado'
      ],
      icon: Search
    },
    {
      number: '02',
      title: 'Strategy & Design',
      shortDesc: 'Definir la estrategia y diseñar la experiencia digital.',
      details: 'Creación del diseño de interfaz (UI), experiencia de usuario (UX), prototipos interactivos en Figma, estructura de navegación y selección de paleta y tipografía.',
      deliverables: [
        'Wireframes y arquitectura de información',
        'Prototipos interactivos de alta fidelidad',
        'Sistema de diseño y componentes UI',
        'Aprobación previa al código'
      ],
      icon: Compass
    },
    {
      number: '03',
      title: 'Development',
      shortDesc: 'Transformar el diseño en una solución funcional.',
      details: 'Codificación con estándares modernos (React 19, TypeScript, Node.js, Tailwind CSS), desarrollo modular, integración de APIs y base de datos.',
      deliverables: [
        'Código limpio con tipado estricto',
        'Integración de APIs y backend seguro',
        'Responsive Design para todos los dispositivos',
        'Ambiente de pruebas (Staging)'
      ],
      icon: Code
    },
    {
      number: '04',
      title: 'Testing & Optimization',
      shortDesc: 'Realizar pruebas, optimizar rendimiento y garantizar calidad.',
      details: 'Auditoría de Core Web Vitals, pruebas de usabilidad, validación de formularios, pruebas de seguridad y compatibilidad navegadores.',
      deliverables: [
        'Optimización Lighthouse 95+ (Performance, SEO)',
        'Compatibilidad Cross-Browser',
        'Pruebas de seguridad',
        'Certificación de carga diferida'
      ],
      icon: CheckCircle
    },
    {
      number: '05',
      title: 'Launch & Support',
      shortDesc: 'Publicar el proyecto y proporcionar soporte.',
      details: 'Despliegue final en producción (Vercel, Cloud Run, AWS), configuración de dominios, certificados SSL, indexación en Google y soporte.',
      deliverables: [
        'Despliegue en servidor de producción',
        'Configuración de DNS y SSL HTTPS',
        'Documentación y manuales',
        'Soporte técnico y garantía'
      ],
      icon: Rocket
    }
  ];

  return (
    <section id="process" className="relative py-24 bg-[#0b0e1b] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10152b] border border-white/10 text-xs font-mono text-[#EC9731] mb-3">
            <span>05. METODOLOGÍA</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl text-balance mb-3">
            Un proceso estructurado para garantizar el éxito.
          </h2>
          <p className="text-sm text-slate-400 max-w-lg text-balance">
            Transparencia total, entregas puntuales y comunicación continua en cada etapa.
          </p>
        </div>

        {/* Timeline Navigation */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4 mb-10">
          {stages.map((stage, idx) => {
            const IconComp = stage.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  soundFX.playClick();
                  setActiveStep(idx);
                }}
                onMouseEnter={() => soundFX.playHover()}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-colors shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#314595] border-[#EC9731] text-white'
                    : 'bg-[#10152b] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <span className={`text-xs font-mono font-bold ${isActive ? 'text-[#EC9731]' : 'text-slate-500'}`}>
                  {stage.number}
                </span>
                <IconComp className="w-4 h-4" />
                <span className="text-xs font-bold whitespace-nowrap">{stage.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detail Panel */}
        <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-extrabold font-mono text-[#EC9731]">
                {stages[activeStep].number}
              </span>
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">ETAPA</span>
                <h3 className="text-2xl font-bold text-white">
                  {stages[activeStep].title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">
              {stages[activeStep].details}
            </p>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#EC9731] font-bold mb-3">
                Entregables Clave:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {stages[activeStep].deliverables.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-300 p-2.5 rounded-lg bg-[#070914] border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EC9731] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6 rounded-xl bg-[#070914] border border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-[#314595]/30 border border-[#314595]/50 text-[#EC9731] flex items-center justify-center mb-4">
              {React.createElement(stages[activeStep].icon, { className: 'w-8 h-8' })}
            </div>

            <h4 className="text-base font-bold text-white mb-1">
              Paso {activeStep + 1} de {stages.length}
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mb-5">
              {stages[activeStep].shortDesc}
            </p>

            {activeStep < stages.length - 1 ? (
              <button
                onClick={() => {
                  soundFX.playClick();
                  setActiveStep(activeStep + 1);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#314595] hover:bg-[#223488] transition-colors cursor-pointer"
              >
                <span>Siguiente Etapa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  soundFX.playClick();
                  const contactEl = document.getElementById('contact');
                  if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#EC9731] hover:bg-[#d88220] transition-colors cursor-pointer"
              >
                <span>Iniciar mi Proyecto</span>
                <Rocket className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
