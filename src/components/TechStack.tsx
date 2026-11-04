import React, { useState } from 'react';
import { soundFX } from '../utils/soundFX';
import { Cpu, Terminal, Database, Cloud, Code } from 'lucide-react';

interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools';
  categoryLabel: string;
  svgIcon: React.ReactNode;
  description: string;
  level: string;
}

export const TechStack: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const techItems: TechItem[] = [
    // Frontend
    {
      name: 'React 19',
      category: 'frontend',
      categoryLabel: 'Frontend',
      description: 'Arquitectura de componentes reactivos y hooks personalizados.',
      level: 'Avanzado',
      svgIcon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(0 12 12)" stroke="#61DAFB" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" stroke="#61DAFB" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" stroke="#61DAFB" />
          <circle cx="12" cy="12" r="2" fill="#61DAFB" />
        </svg>
      )
    },
    {
      name: 'TypeScript',
      category: 'frontend',
      categoryLabel: 'Frontend',
      description: 'Tipado estático estricto e interfaces complejas.',
      level: 'Avanzado',
      svgIcon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#3178C6" />
          <path d="M11.5 15.5H9.5V8.5H13V10H11.5V15.5ZM17.5 10.5C17 9.8 16.2 9.5 15.2 9.5C14 9.5 13.2 10.2 13.2 11.2C13.2 13.5 17.5 12.2 17.5 14.8C17.5 16 16.3 16.8 15 16.8C13.8 16.8 12.8 16 12.4 15.2L13.6 14.2C14 14.8 14.6 15.2 15.2 15.2C15.8 15.2 16.2 14.8 16.2 14.4C16.2 12.3 12 13.5 12 11C12 9.6 13.2 8.5 15.2 8.5C16.5 8.5 17.5 9.2 18.2 10.2L17.5 10.5Z" fill="white" />
        </svg>
      )
    },
    {
      name: 'JavaScript (ES6+)',
      category: 'frontend',
      categoryLabel: 'Frontend',
      description: 'Programación asíncrona avanzada, Promises y Async/Await.',
      level: 'Experto',
      svgIcon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#F7DF1E" />
          <path d="M11 16.5C11 17.5 10.2 18 9 18C7.5 18 6.5 17 6 16L7.2 14.8C7.6 15.5 8.2 16 9 16C9.5 16 9.8 15.8 9.8 15.4V11H11V16.5ZM17 16.5C17 17.5 16.2 18 15 18C13.5 18 12.5 17 12 16L13.2 14.8C13.6 15.5 14.2 16 15 16C15.5 16 15.8 15.8 15.8 15.4C15.8 14.5 13.5 14 13.5 12.5C13.5 11.5 14.5 10.5 16 10.5C17.2 10.5 18 11.2 18.4 12L17.2 12.8C16.9 12.3 16.5 11.8 16 11.8C15.5 11.8 15 12.1 15 12.5C15 13.4 17.3 13.8 17.3 15.3C17.3 15.8 17.1 16.2 17 16.5Z" fill="#000000" />
        </svg>
      )
    },
    {
      name: 'HTML5 & SEO',
      category: 'frontend',
      categoryLabel: 'Frontend',
      description: 'Estructuración semántica y accesibilidad universal.',
      level: 'Experto',
      svgIcon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
          <path d="M3 3L5 20L12 22L19 20L21 3H3Z" fill="#E34F26" />
          <path d="M12 4.5V20.3L17.5 18.8L19.2 4.5H12Z" fill="#EF652A" />
          <path d="M7 8H17L16.5 12H8L8.5 16.5L12 17.5L15.5 16.5L15.8 14H18L17.5 18.5L12 20L6.5 18.5L5.5 8Z" fill="white" />
        </svg>
      )
    },
    {
      name: 'Tailwind CSS v4',
      category: 'frontend',
      categoryLabel: 'Frontend',
      description: 'Layouts Grid/Flexbox asimétricos y diseño atómico.',
      level: 'Experto',
      svgIcon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
          <path d="M12 6C9.33333 6 7.66667 7.33333 7 10C8 8.66667 9.16667 8.16667 10.5 8.5C11.4507 8.73767 12.1306 9.42867 12.8845 10.1953C14.1126 11.444 15.5208 12.8667 19 12.8667C21.6667 12.8667 23.3333 11.5333 24 8.86667C23 10.2 21.8333 10.7 20.5 10.3667C19.5493 10.129 18.8694 9.438 18.1155 8.67133C16.8874 7.42267 15.4792 6 12 6ZM5 12.8667C2.33333 12.8667 0.666667 14.2 0 16.8667C1 15.5333 2.16667 15.0333 3.5 15.3667C4.45067 15.6043 5.1306 16.2953 5.88447 17.062C7.1126 18.3107 8.52077 19.7333 12 19.7333C14.6667 19.7333 16.3333 18.4 17 15.7333C16 17.0667 14.8333 17.5667 13.5 17.2333C12.5493 16.9957 11.8694 16.3047 11.1155 15.538C9.8874 14.2893 8.47923 12.8667 5 12.8667Z" fill="#38BDF8" />
        </svg>
      )
    },

    // Backend
    {
      name: 'Node.js',
      category: 'backend',
      categoryLabel: 'Backend',
      description: 'Servidores HTTP no bloqueantes y desarrollo de microservicios.',
      level: 'Avanzado',
      svgIcon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7.8V16.2L12 22L22 16.2V7.8L12 2Z" fill="#5FA04E" />
          <path d="M12 4.5L19.5 8.8V15.2L12 19.5L4.5 15.2V8.8L12 4.5Z" fill="#333333" />
          <path d="M12 6L17.5 9.2V14.8L12 18L6.5 14.8V9.2L12 6Z" fill="#68A063" />
        </svg>
      )
    },
    {
      name: 'PHP',
      category: 'backend',
      categoryLabel: 'Backend',
      description: 'Backend robusto y arquitectura MVC.',
      level: 'Avanzado',
      svgIcon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="12" rx="10" ry="6" fill="#777BB4" />
          <text x="12" y="14" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">PHP</text>
        </svg>
      )
    },
    {
      name: 'Python',
      category: 'backend',
      categoryLabel: 'Backend',
      description: 'Scripting de automatización y APIs REST.',
      level: 'Intermedio',
      svgIcon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
          <path d="M11.8 2C6.8 2 7 4.2 7 4.2V6.3H12V7H5C3.3 7 2 8.5 2 10.8C2 13 3.3 14 5 14H6.3V12C6.3 9.8 7.8 8.5 10 8.5H14.5C15.6 8.5 16.5 7.6 16.5 6.5V4.5C16.5 3 15 2 11.8 2ZM9.5 3.5C10 3.5 10.5 4 10.5 4.5C10.5 5 10 5.5 9.5 5.5C9 5.5 8.5 5 8.5 4.5C8.5 4 9 3.5 9.5 3.5Z" fill="#3776AB" />
          <path d="M12.2 22C17.2 22 17 19.8 17 19.8V17.7H12V17H19C20.7 17 22 15.5 22 13.2C22 11 20.7 10 19 10H17.7V12C17.7 14.2 16.2 15.5 14 15.5H9.5C8.4 15.5 7.5 16.4 7.5 17.5V19.5C7.5 21 9 22 12.2 22ZM14.5 20.5C14 20.5 13.5 20 13.5 19.5C13.5 19 14 18.5 14.5 18.5C15 18.5 15.5 19 15.5 19.5C15.5 20 15 20.5 14.5 20.5Z" fill="#FFD43B" />
        </svg>
      )
    },

    // Databases
    {
      name: 'PostgreSQL',
      category: 'database',
      categoryLabel: 'Bases de Datos',
      description: 'Consultas relacionales complejas e indexación.',
      level: 'Avanzado',
      svgIcon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" fill="#336791" />
          <path d="M12 6C9 6 7 8 7 11C7 14 9 16 12 16C15 16 17 14 17 11C17 8 15 6 12 6Z" stroke="white" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      name: 'MySQL',
      category: 'database',
      categoryLabel: 'Bases de Datos',
      description: 'Modelado relacional de datos e InnoDB.',
      level: 'Avanzado',
      svgIcon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#00758F" />
          <path d="M7 15L9 9L11 15M13 9V15M16 9V15" stroke="#F29111" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      name: 'MongoDB',
      category: 'database',
      categoryLabel: 'Bases de Datos',
      description: 'Bases de datos Orientadas a Documentos.',
      level: 'Intermedio',
      svgIcon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C12 2 6 9 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9 12 2 12 2Z" fill="#47A248" />
          <path d="M12 2V20" stroke="#13AA52" strokeWidth="1.5" />
        </svg>
      )
    },

    // Tools
    {
      name: 'Docker',
      category: 'tools',
      categoryLabel: 'Herramientas',
      description: 'Contenerización y entornos aislados.',
      level: 'Avanzado',
      svgIcon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#2496ED" />
          <path d="M6 13H8V15H6V13ZM9 13H11V15H9V13ZM12 13H14V15H12V13ZM9 10H11V12H9V10ZM12 10H14V12H12V10ZM15 10H17V12H15V10Z" fill="white" />
        </svg>
      )
    },
    {
      name: 'GitHub & CI/CD',
      category: 'tools',
      categoryLabel: 'Herramientas',
      description: 'Control de versiones Git y GitHub Actions.',
      level: 'Experto',
      svgIcon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      name: 'Figma',
      category: 'tools',
      categoryLabel: 'Herramientas',
      description: 'Prototipado interactivo y componentes.',
      level: 'Avanzado',
      svgIcon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
          <path d="M8 2H12V8H8C6.34 8 5 6.66 5 5C5 3.34 6.34 2 8 2Z" fill="#F24E1E" />
          <path d="M12 2H16C17.66 2 19 3.34 19 5C19 6.66 17.66 8 16 8H12V2Z" fill="#FF7262" />
          <path d="M12 8H16C17.66 8 19 9.34 19 11C19 12.66 17.66 14 16 14H12V8Z" fill="#1ABCFE" />
          <path d="M5 11C5 9.34 6.34 8 8 8H12V14H8C6.34 14 5 12.66 5 11Z" fill="#0ACF83" />
          <path d="M5 17C5 15.34 6.34 14 8 14H12V17C12 18.66 10.66 20 9 20C7.34 20 6 18.66 5 17Z" fill="#A259FF" />
        </svg>
      )
    },
    {
      name: 'APIs REST & Cloud',
      category: 'tools',
      categoryLabel: 'Herramientas',
      description: 'Integración de servicios Serverless y Cloud APIs.',
      level: 'Avanzado',
      svgIcon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#314595" />
          <path d="M7 12H17M12 7V17" stroke="#EC9731" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  const categories = [
    { id: 'all', label: 'Todas', icon: Code },
    { id: 'frontend', label: 'Frontend', icon: Cpu },
    { id: 'backend', label: 'Backend', icon: Terminal },
    { id: 'database', label: 'Bases de Datos', icon: Database },
    { id: 'tools', label: 'Herramientas', icon: Cloud }
  ];

  const filteredItems = activeCategory === 'all'
    ? techItems
    : techItems.filter(item => item.category === activeCategory);

  return (
    <section id="tech-stack" className="relative py-24 bg-[#0b0e1b] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10152b] border border-white/10 text-xs font-mono text-[#EC9731] mb-3">
            <span>03. TECH STACK</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl text-balance mb-3">
            Herramientas y tecnologías de última generación.
          </h2>
          <p className="text-sm text-slate-400 max-w-lg text-balance">
            Seleccionadas para construir productos rápidos, seguros y mantenibles.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => {
            const IconComp = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundFX.playClick();
                  setActiveCategory(cat.id);
                }}
                onMouseEnter={() => soundFX.playHover()}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#314595] text-white border border-[#EC9731]'
                    : 'bg-[#10152b] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-[#EC9731]' : ''}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredItems.map((tech, idx) => (
            <div
              key={idx}
              onMouseEnter={() => soundFX.playHover()}
              className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/10 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    {tech.svgIcon}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#314595]/30 text-slate-300">
                    {tech.level}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#EC9731] transition-colors">
                  {tech.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {tech.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400">
                {tech.categoryLabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
