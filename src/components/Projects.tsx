import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ProjectItem, ProjectModal } from './ProjectModal';
import { soundFX } from '../utils/soundFX';

export const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const initialProjects: ProjectItem[] = [
    {
      id: 'fintech-aether',
      name: 'Aether Finance — Dashboard SaaS',
      category: 'Applications',
      categoryKey: 'applications',
      description: 'Plataforma de inteligencia financiera con visualizaciones de datos en tiempo real.',
      fullCaseStudy: `Desafío: Crear una interfaz analítica capaz de renderizar miles de puntos de datos financieros a 60 FPS.
      
      Solución: Implementé una arquitectura basada en React 19, HTML5 Canvas renderers y WebSocket streams.`,
      image: '/src/assets/images/project_fintech_dashboard_1793804255148.jpg',
      techStack: ['React 19', 'TypeScript', 'Node.js', 'Canvas API', 'Tailwind CSS'],
      demoUrl: 'https://example.com/aether-demo',
      metrics: ['60 FPS en Renderizado de Gráficos', 'Sub-50ms Latencia', '99.9% Core Web Vitals'],
      architectureNotes: 'Micro-frontend estructurado con Vite, tipado estricto TypeScript y estado global optimizado.'
    },
    {
      id: 'ecommerce-[#223488]',
      name: 'Nocturne — E-Commerce de Lujo',
      category: 'E-commerce',
      categoryKey: 'ecommerce',
      description: 'Tienda digital para mobiliario de diseño con navegación envolvente y checkout acelerado.',
      fullCaseStudy: `Desafío: Diseñar una tienda e-commerce que transmita exclusividad manteniendo cargas inferiores a 1 segundo.
      
      Solución: Maquetación con Tailwind CSS v4, carga diferida inteligente e integración con Stripe Checkout headless.`,
      image: '/src/assets/images/project_ecommerce_luxury_1793804254986.jpg',
      techStack: ['React', 'Next.js', 'Stripe API', 'Tailwind CSS'],
      demoUrl: 'https://example.com/nocturne-store',
      metrics: ['+42% Conversión Checkout', '0.8s Carga Inicial', '100% Accesibilidad'],
      architectureNotes: 'Headless E-Commerce con renderizado híbrido SSG/ISR y CDN global.'
    },
    {
      id: 'ai-aether-platform',
      name: 'Aether AI — Plataforma de Trabajo',
      category: 'Custom Solutions',
      categoryKey: 'custom',
      description: 'Entorno de trabajo con editor de nodos para la automatización de procesos mediante IA.',
      fullCaseStudy: `Desafío: Crear un editor visual de nodos canvas interactivo para conectar tuberías de datos.
      
      Solución: Motor de nodos personalizado con conexión electromagnética de cables SVG y persistencia en tiempo real.`,
      image: '/src/assets/images/project_ai_platform_1793804254740.jpg',
      techStack: ['TypeScript', 'React', 'Gemini API', 'Express'],
      demoUrl: 'https://example.com/aether-ai',
      metrics: ['+300% Eficiencia Operativa', 'Editor Nodos Canvas 60fps', 'Sincronización Cloud'],
      architectureNotes: 'Servidor Express proxy con integración de Gemini API y persistencia relacional.'
    },
    {
      id: 'creative-aura-visuals',
      name: 'Aura Visuals — Agencia Creativa',
      category: 'Web Design',
      categoryKey: 'web-design',
      description: 'Sitio web editorial para estudio de dirección de arte con tipografía monumental.',
      fullCaseStudy: `Desafío: Romper con las cuadrículas genéricas de plantillas web y construir un escaparate memorable.
      
      Solución: Composiciones asimétricas, tipografía 'Plus Jakarta Sans' y transiciones de scroll orgánicas.`,
      image: '/src/assets/images/project_creative_agency_1793804255506.jpg',
      techStack: ['React', 'Motion', 'Tailwind CSS', 'Vite'],
      demoUrl: 'https://example.com/aura-visuals',
      metrics: ['Distinción de Diseño', '100% Experiencia Mobile', '3.5 min Sesión'],
      architectureNotes: 'Vite SPA optimizado con animaciones compositoras CSS GPU-accelerated.'
    }
  ];

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'web-design', label: 'Web Design' },
    { id: 'web-dev', label: 'Web Development' },
    { id: 'applications', label: 'Applications' },
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'custom', label: 'Custom Solutions' }
  ];

  const filteredProjects = activeCategory === 'all'
    ? initialProjects
    : initialProjects.filter(p => p.categoryKey === activeCategory);

  return (
    <section id="projects" className="relative py-24 bg-[#0b0e1b] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10152b] border border-white/10 text-xs font-mono text-[#EC9731] mb-3">
            <span>04. PROYECTOS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl text-balance mb-3">
            Proyectos que convierten ideas en soluciones.
          </h2>
          <p className="text-sm text-slate-400 max-w-lg text-balance">
            Trabajos desarrollados con enfoque en calidad, velocidad y usabilidad.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundFX.playClick();
                setActiveCategory(cat.id);
              }}
              onMouseEnter={() => soundFX.playHover()}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#314595] text-white border border-[#EC9731]'
                  : 'bg-[#10152b] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onMouseEnter={() => soundFX.playHover()}
              className="group glass-panel glass-panel-hover rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between"
            >
              {/* Image Box */}
              <div
                onClick={() => {
                  soundFX.playClick();
                  setSelectedProject(project);
                }}
                className="relative aspect-video overflow-hidden cursor-pointer bg-[#070914]"
              >
                <img
                  src={project.image}
                  alt={project.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
                />

                <div className="absolute top-4 left-4 z-10">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0b0e1b] border border-white/20 text-[11px] font-mono font-bold text-[#EC9731]">
                    {project.category}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 z-10">
                  <div className="p-2.5 rounded-full bg-[#EC9731] text-white shadow-lg">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3
                    onClick={() => {
                      soundFX.playClick();
                      setSelectedProject(project);
                    }}
                    className="text-xl font-bold text-white mb-2 group-hover:text-[#EC9731] transition-colors cursor-pointer"
                  >
                    {project.name}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {project.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 text-xs font-mono text-slate-400">
                  <div className="flex flex-wrap items-center gap-2">
                    {project.techStack.map((tech, idx) => (
                      <React.Fragment key={idx}>
                        <span>{tech}</span>
                        {idx < project.techStack.length - 1 && <span className="text-slate-600">·</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setSelectedProject(project);
                    }}
                    className="font-bold text-[#EC9731] hover:underline shrink-0 cursor-pointer"
                  >
                    Ver Caso
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
};
