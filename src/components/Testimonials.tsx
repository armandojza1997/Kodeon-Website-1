import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2, MessageSquarePlus, X } from 'lucide-react';
import { soundFX } from '../utils/soundFX';

interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  company: string;
  avatarText: string;
  quote: string;
  projectType: string;
  rating: number;
}

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    clientName: 'Alejandro Valenzuela',
    role: 'CEO & Co-founder',
    company: 'Lumina Fintech',
    avatarText: 'AV',
    quote: 'El trabajo de Códix superó todas nuestras expectativas. Rediseñaron nuestro dashboard SaaS con una fluidez impecable a 60 FPS y una arquitectura en React que aumentó nuestra retención de usuarios en un 42% en el primer mes.',
    projectType: 'Aplicación Web & SaaS',
    rating: 5
  },
  {
    id: 'test-2',
    clientName: 'Sofía Montemayor',
    role: 'Directora de Marca',
    company: 'Chrono Luxury Store',
    avatarText: 'SM',
    quote: 'Buscábamos una tienda online que transmitiera exclusividad y velocidad extrema. Códix entregó un e-commerce ultrarrápido con pasarela Stripe integrada que redujo la fricción de pago a un solo clic.',
    projectType: 'E-commerce de Alto Rendimiento',
    rating: 5
  },
  {
    id: 'test-3',
    clientName: 'Dr. Mateo Sotomayor',
    role: 'Director Médico',
    company: 'Pulse Telemedicina',
    avatarText: 'MS',
    quote: 'La atención al detalle en el diseño UI/UX y la robustez del backend superaron lo que habíamos visto con agencias tradicionales. Su metodología en fases nos mantuvo informados cada semana.',
    projectType: 'Plataforma Web a Medida',
    rating: 5
  },
  {
    id: 'test-4',
    clientName: 'Valeria Cárdenas',
    role: 'Chief Technology Officer',
    company: 'Nexus AI Solutions',
    avatarText: 'VC',
    quote: 'Trabajar con Códix fue una experiencia técnica excepcional. Su dominio de TypeScript, Tailwind y optimización Core Web Vitals nos permitió posicionar nuestra plataforma en el top de Google desde el día uno.',
    projectType: 'Desarrollo Web & SEO Pro',
    rating: 5
  }
];

const PROJECT_TYPES = [
  'Aplicación Web & SaaS',
  'E-commerce de Alto Rendimiento',
  'Diseño UI/UX en Figma',
  'Plataforma Web a Medida',
  'Desarrollo Web & SEO Pro',
  'Automatización & APIs'
];

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem('codix_user_testimonials');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_TESTIMONIALS;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Modal Form State
  const [showModal, setShowModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formQuote, setFormQuote] = useState('');
  const [formProject, setFormProject] = useState(PROJECT_TYPES[0]);
  const [formRating, setFormRating] = useState(5);
  const [successBanner, setSuccessBanner] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Save to localStorage when testimonials update
  useEffect(() => {
    try {
      localStorage.setItem('codix_user_testimonials', JSON.stringify(testimonials));
    } catch {
      // ignore
    }
  }, [testimonials]);

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused || showModal) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, showModal, testimonials.length]);

  const handlePrev = () => {
    soundFX.playClick();
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    soundFX.playClick();
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleDotClick = (idx: number) => {
    soundFX.playClick();
    setCurrentIndex(idx);
  };

  const handleSubmitTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCompany.trim() || !formQuote.trim()) {
      setFormError('Por favor completa tu Nombre, Empresa y Testimonio.');
      return;
    }

    setFormError(null);
    soundFX.playSuccess();

    const initials = formName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newTestimonial: Testimonial = {
      id: `user-test-${Date.now()}`,
      clientName: formName.trim(),
      role: formRole.trim() || 'Cliente / Socio',
      company: formCompany.trim(),
      avatarText: initials || 'CX',
      quote: formQuote.trim(),
      projectType: formProject,
      rating: formRating
    };

    setTestimonials((prev) => [newTestimonial, ...prev]);
    setCurrentIndex(0);
    setShowModal(false);
    setSuccessBanner(true);

    setFormName('');
    setFormRole('');
    setFormCompany('');
    setFormQuote('');

    setTimeout(() => {
      setSuccessBanner(false);
    }, 5000);
  };

  const current = testimonials[currentIndex] || testimonials[0];

  return (
    <section id="testimonials" className="relative py-24 bg-[#0b0e1b] border-t border-white/10 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#314595]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10152b] border border-white/10 text-xs font-mono text-[#EC9731] mb-3">
            <span>06. TESTIMONIOS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl text-balance">
            Lo que dicen nuestros <span className="text-[#EC9731]">clientes</span>.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-xl">
            Historias de éxito y experiencias de transformación digital con Códix.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              soundFX.playClick();
              setShowModal(true);
            }}
            onMouseEnter={() => soundFX.playHover()}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10152b] hover:bg-[#161d3a] border border-[#EC9731]/50 hover:border-[#EC9731] text-xs font-mono text-white transition-all cursor-pointer shadow-lg group"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#EC9731]" />
            <span>Escribe tu propio testimonio</span>
          </motion.button>
        </div>

        {successBanner && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto mb-8 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center gap-3 shadow-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>¡Testimonio publicado con éxito! Se ha añadido al carrusel principal.</span>
          </motion.div>
        )}

        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative max-w-4xl mx-auto"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative overflow-hidden backdrop-blur-xl bg-[#10152b]/60"
            >
            <div className="absolute top-6 right-8 text-white/5 pointer-events-none">
              <Quote className="w-24 h-24" />
            </div>

            <div className="relative z-10 flex flex-col justify-between min-h-[220px]">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#EC9731] text-[#EC9731]" />
                  ))}
                </div>

                <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#314595]/40 border border-[#314595] text-[#EC9731]">
                  {current.projectType}
                </span>
              </div>

              <p className="text-base sm:text-xl text-slate-100 font-normal leading-relaxed italic mb-8">
                "{current.quote}"
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <div className="w-12 h-12 rounded-xl bg-[#314595] border border-white/20 flex items-center justify-center text-white font-mono font-bold text-sm shadow-inner">
                  {current.avatarText}
                </div>

                <div>
                  <h4 className="font-bold text-white text-base">{current.clientName}</h4>
                  <p className="text-xs text-slate-400 font-mono">
                    {current.role} • <strong className="text-slate-200">{current.company}</strong>
                  </p>
                </div>
              </div>
            </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-[60%]">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  aria-label={`Ir al testimonio ${idx + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? 'w-8 bg-[#EC9731]' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                onMouseEnter={() => soundFX.playHover()}
                aria-label="Testimonio anterior"
                className="p-3 rounded-xl bg-[#10152b] hover:bg-[#161d3a] border border-white/15 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                onMouseEnter={() => soundFX.playHover()}
                aria-label="Siguiente testimonio"
                className="p-3 rounded-xl bg-[#10152b] hover:bg-[#161d3a] border border-white/15 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal for writing testimonial */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0e1b]/90 backdrop-blur-2xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg bg-[#10152b] border border-white/10 rounded-3xl p-8 shadow-2xl relative"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-bold text-white mb-6">Comparte tu experiencia</h3>
              <form onSubmit={handleSubmitTestimonial} className="space-y-4">
                <input type="text" placeholder="Tu nombre" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:border-[#EC9731] outline-none" />
                <div className="flex gap-4">
                    <input type="text" placeholder="Rol" value={formRole} onChange={(e) => setFormRole(e.target.value)} className="w-1/2 bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:border-[#EC9731] outline-none" />
                    <input type="text" placeholder="Empresa" value={formCompany} onChange={(e) => setFormCompany(e.target.value)} className="w-1/2 bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:border-[#EC9731] outline-none" />
                </div>
                <textarea placeholder="Tu testimonio..." value={formQuote} onChange={(e) => setFormQuote(e.target.value)} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:border-[#EC9731] outline-none" />
                <select value={formProject} onChange={(e) => setFormProject(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#EC9731] outline-none">
                    {PROJECT_TYPES.map(type => <option key={type} value={type} className="bg-[#10152b]">{type}</option>)}
                </select>
                {formError && <p className="text-red-400 text-xs font-mono">{formError}</p>}
                <button type="submit" className="w-full bg-[#EC9731] hover:bg-[#d88a2c] text-white font-bold py-3 rounded-xl transition-all">Publicar Testimonio</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
