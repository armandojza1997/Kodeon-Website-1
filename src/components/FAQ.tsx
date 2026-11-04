import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/soundFX';

interface FaqItem {
  question: string;
  answer: string;
  category: 'Proceso' | 'Inversión' | 'Tiempos' | 'Garantía';
}

const FAQ_ITEMS: FaqItem[] = [
  {
    category: 'Proceso',
    question: '¿Cómo es el proceso de trabajo desde que iniciamos un proyecto?',
    answer: 'Trabajamos en 5 fases ágiles: 1) Discovery & Strategy (análisis de objetivos y requerimientos), 2) UI/UX Design & Prototyping (diseño en Figma y validación), 3) Core Development (programación en React, TypeScript y backend robusto con entregas semanales), 4) QA & Optimization (auditoría de velocidad Core Web Vitals y seguridad), y 5) Launch (despliegue en producción).'
  },
  {
    category: 'Inversión',
    question: '¿Cuáles son las formas de pago y condiciones comerciales?',
    answer: 'Trabajamos con un esquema transparente de 50% de anticipo para reservar el sprint de desarrollo y el 50% restante al desplegar en producción una vez que estés 100% conforme. Para proyectos superiores a $4,000 USD, podemos estructurar pagos en 3 o 4 hitos contra entregas demostrables. Aceptamos transferencias bancarias y tarjetas vía Stripe.'
  },
  {
    category: 'Tiempos',
    question: '¿Cuánto tiempo toma desarrollar un proyecto web o aplicación?',
    answer: 'Los plazos varían según la complejidad: las Landing Pages y sitios web corporativos toman entre 10 y 14 días hábiles; los prototipos UI/UX en Figma de 7 a 10 días; los E-commerce completos entre 2 y 4 semanas; y las Aplicaciones Web SaaS complejas entre 3 y 6 semanas. Cumplimos rigurosamente los cronogramas fijados en contrato.'
  },
  {
    category: 'Garantía',
    question: '¿Qué incluye la garantía posterior al lanzamiento?',
    answer: 'Todos nuestros proyectos incluyen 30 días de garantía total post-lanzamiento sin coste adicional para corregir cualquier incidencia, realizar ajustes finos y brindarte videos de capacitación en alta definición para que gestiones tu plataforma con total autonomía.'
  },
  {
    category: 'Proceso',
    question: '¿Quién es el propietario del código fuente y los diseños?',
    answer: 'El 100% de la propiedad intelectual pertenece a ti. Una vez liquidado el proyecto, te transferimos la totalidad de los repositorios en GitHub, accesos a tus cuentas cloud (Vercel, AWS, Cloudflare) y los archivos fuente editables en Figma sin ataduras ni dependencias.'
  },
  {
    category: 'Inversión',
    question: '¿Por qué elegir desarrollo a medida en lugar de plantillas de WordPress?',
    answer: 'Las plantillas de WordPress y constructores visuales suelen cargar en 4 a 8 segundos y son vulnerables a ataques por plugins desactualizados. En Códix desarrollamos a medida con React, TypeScript y Tailwind, logrando cargas inferiores a 0.8 segundos, Core Web Vitals de 95+ y un diseño 100% exclusivo para tu marca.'
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Proceso', 'Inversión', 'Tiempos', 'Garantía'];

  const filteredFaqs = selectedCategory === 'Todos'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((item) => item.category === selectedCategory);

  const toggleAccordion = (idx: number) => {
    soundFX.playClick();
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative py-24 bg-[#0b0e1b] border-t border-white/10 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#EC9731]/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10152b] border border-white/10 text-xs font-mono text-[#EC9731] mb-3">
            <span>07. FAQ</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl text-balance">
            Preguntas <span className="text-[#EC9731]">Frecuentes</span>.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-xl">
            Todo lo que necesitas saber sobre nuestros plazos, metodología y condiciones comerciales.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundFX.playClick();
                  setSelectedCategory(cat);
                  setOpenIndex(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#314595] text-white border border-[#314595] shadow-lg'
                    : 'bg-[#10152b] hover:bg-[#161d3a] text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`glass-panel rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-[#EC9731]/60 bg-[#121833]/90 shadow-[0_10px_30px_rgba(236,151,49,0.15)]'
                    : 'border-white/10 bg-[#10152b]/60 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  onMouseEnter={() => soundFX.playHover()}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#314595]/30 border border-[#314595]/60 text-[#EC9731]">
                      {faq.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {faq.question}
                    </h3>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 shrink-0 ${
                      isOpen ? 'bg-[#EC9731] text-[#0b0e1b]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 pt-1 text-sm text-slate-300 leading-relaxed font-sans border-t border-white/5"
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
