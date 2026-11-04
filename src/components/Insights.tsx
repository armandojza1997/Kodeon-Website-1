import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';
import { soundFX } from '../utils/soundFX';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
}

const ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'El Futuro del Desarrollo Web: React 19 y Server Components',
    excerpt: 'Analizamos cómo los Server Components están cambiando la forma en que construimos aplicaciones escalables.',
    category: 'Ingeniería',
    readTime: '5 min',
    date: 'Nov 4, 2026'
  },
  {
    id: 'art-2',
    title: 'Optimización de Core Web Vitals en E-commerce de Lujo',
    excerpt: 'Estrategias técnicas para lograr tiempos de carga inferiores a 1 segundo sin sacrificar calidad visual.',
    category: 'Performance',
    readTime: '7 min',
    date: 'Oct 28, 2026'
  },
  {
    id: 'art-3',
    title: 'IA Integrada: El siguiente nivel en la automatización empresarial',
    excerpt: 'Cómo la API de Gemini está permitiendo crear experiencias de usuario personalizadas y proactivas.',
    category: 'Innovación',
    readTime: '6 min',
    date: 'Oct 15, 2026'
  }
];

export const Insights: React.FC = () => {
  return (
    <section id="insights" className="relative py-24 bg-[#0b0e1b] border-t border-white/10 overflow-hidden">
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-[#314595]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10152b] border border-white/10 text-xs font-mono text-[#EC9731] mb-3">
            <span>08. INSIGHTS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl text-balance mb-3">
            Artículos técnicos y <span className="text-[#EC9731]">pensamientos</span>.
          </h2>
          <p className="text-sm text-slate-400 max-w-lg text-balance">
            Compartimos nuestra experiencia en el ecosistema de desarrollo moderno.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onMouseEnter={() => soundFX.playHover()}
              className="group glass-panel glass-panel-hover rounded-2xl border border-white/10 p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:border-[#EC9731]/50"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#314595]/20 border border-[#314595]/40 text-[10px] font-mono font-bold text-[#EC9731]">
                    {article.category}
                  </span>
                  <div className="flex items-center text-[10px] text-slate-500 font-mono gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#EC9731] transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-slate-500 font-mono">
                <span>{article.date}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#EC9731] transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
