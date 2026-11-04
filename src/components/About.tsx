import React, { useState } from 'react';
import { Award, Zap, ShieldCheck, Target, Terminal } from 'lucide-react';
import { soundFX } from '../utils/soundFX';

export const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'performance' | 'quality'>('architecture');

  const pillars = [
    {
      icon: Target,
      title: 'Creatividad & Pensamiento Estratégico',
      desc: 'Analizo los objetivos del negocio y diseño soluciones pensadas para captar y convertir.'
    },
    {
      icon: Zap,
      title: 'Desarrollo Orientado a Resultados',
      desc: 'Código optimizado para máxima velocidad, posicionamiento SEO y retención de usuarios.'
    },
    {
      icon: Award,
      title: 'Atención al Detalle & UI/UX Precision',
      desc: 'Interfaces perfeccionadas y transiciones fluidas a 60 FPS en todos los dispositivos.'
    },
    {
      icon: Terminal,
      title: 'Tecnologías Modernas & Escalabilidad',
      desc: 'Stack robusto basado en React, TypeScript, Node.js y ecosistemas Cloud.'
    },
    {
      icon: ShieldCheck,
      title: 'Compromiso con la Calidad & Rendimiento',
      desc: 'Auditorías de seguridad, accesibilidad WCAG AA y puntuación 95+ en Core Web Vitals.'
    }
  ];

  return (
    <section id="about" className="relative py-24 bg-[#0b0e1b] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10152b] border border-white/10 text-xs font-mono text-[#EC9731] mb-3">
            <span>01. SOBRE MÍ</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl text-balance">
            Detrás de cada gran experiencia digital existe una gran idea.
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="glass-panel p-7 rounded-2xl border border-white/10">
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-4">
                Soy desarrollador web enfocado en la creación de sitios web de alto nivel, aplicaciones reactivas e interfaces avanzadas.
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                Mi trabajo combina diseño UI/UX e ingeniería frontend para transformar visiones complejas en productos digitales modernos.
              </p>
            </div>

            {/* Pillars */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold mb-1">
                PILARES DE TRABAJO
              </h3>
              {pillars.map((pillar, idx) => {
                const IconComp = pillar.icon;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => soundFX.playHover()}
                    className="glass-panel glass-panel-hover p-4 rounded-xl flex items-start gap-4"
                  >
                    <div className="p-2.5 rounded-lg bg-[#314595]/30 text-[#EC9731] shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">{pillar.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{pillar.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Engineering Matrix */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#EC9731]" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    CONSOLE
                  </span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              {/* Tabs */}
              <div className="flex p-1 bg-[#070914] rounded-lg border border-white/10">
                <button
                  onClick={() => { soundFX.playClick(); setActiveTab('architecture'); }}
                  className={`flex-1 py-1.5 text-xs font-mono font-semibold rounded transition-colors cursor-pointer ${
                    activeTab === 'architecture' ? 'bg-[#314595] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Arquitectura
                </button>
                <button
                  onClick={() => { soundFX.playClick(); setActiveTab('performance'); }}
                  className={`flex-1 py-1.5 text-xs font-mono font-semibold rounded transition-colors cursor-pointer ${
                    activeTab === 'performance' ? 'bg-[#314595] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Performance
                </button>
                <button
                  onClick={() => { soundFX.playClick(); setActiveTab('quality'); }}
                  className={`flex-1 py-1.5 text-xs font-mono font-semibold rounded transition-colors cursor-pointer ${
                    activeTab === 'quality' ? 'bg-[#314595] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Calidad
                </button>
              </div>

              {/* Code Panel */}
              <div className="p-4 rounded-xl bg-[#070914] border border-white/5 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto min-h-[170px]">
                {activeTab === 'architecture' && (
                  <div className="space-y-1.5">
                    <p className="text-slate-500">// Stack Strategy</p>
                    <p><span className="text-[#EC9731]">const</span> architecture = {'{'}</p>
                    <p className="pl-4">framework: <span className="text-emerald-400">'React 19 + TypeScript'</span>,</p>
                    <p className="pl-4">bundler: <span className="text-emerald-400">'Vite Modular'</span>,</p>
                    <p className="pl-4">styling: <span className="text-emerald-400">'Tailwind CSS v4'</span></p>
                    <p>{'};'}</p>
                  </div>
                )}

                {activeTab === 'performance' && (
                  <div className="space-y-1.5">
                    <p className="text-slate-500">// Core Web Vitals</p>
                    <p><span className="text-[#EC9731]">const</span> vitals = {'{'}</p>
                    <p className="pl-4">LCP: <span className="text-emerald-400">'&lt; 1.2s'</span>,</p>
                    <p className="pl-4">FID_INP: <span className="text-emerald-400">'&lt; 50ms'</span>,</p>
                    <p className="pl-4">CLS: <span className="text-emerald-400">'0.00'</span></p>
                    <p>{'};'}</p>
                  </div>
                )}

                {activeTab === 'quality' && (
                  <div className="space-y-1.5">
                    <p className="text-slate-500">// Code Standards</p>
                    <p><span className="text-[#EC9731]">const</span> standards = {'{'}</p>
                    <p className="pl-4">typeSafety: <span className="text-emerald-400">'Strict TS'</span>,</p>
                    <p className="pl-4">accessibility: <span className="text-emerald-400">'WCAG AA'</span></p>
                    <p>{'};'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Metrics Strip */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-panel p-4 rounded-xl border border-white/10 text-center">
                <span className="text-2xl font-extrabold text-[#EC9731] font-mono mb-0.5 block">5+</span>
                <span className="text-xs text-slate-400 font-medium">Años Experiencia</span>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-white/10 text-center">
                <span className="text-2xl font-extrabold text-[#EC9731] font-mono mb-0.5 block">40+</span>
                <span className="text-xs text-slate-400 font-medium">Proyectos Entregados</span>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-white/10 text-center">
                <span className="text-2xl font-extrabold text-[#EC9731] font-mono mb-0.5 block">99.8%</span>
                <span className="text-xs text-slate-400 font-medium">Core Web Vitals</span>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-white/10 text-center">
                <span className="text-2xl font-extrabold text-[#EC9731] font-mono mb-0.5 block">100%</span>
                <span className="text-xs text-slate-400 font-medium">Satisfacción</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
