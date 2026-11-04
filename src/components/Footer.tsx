import React, { useState, useRef } from 'react';
import { ArrowUp, Github, Linkedin, Mail, Sparkles } from 'lucide-react';
import { PrivacyModal } from './PrivacyModal';
import { Aura3DEasterEgg } from './Aura3DEasterEgg';
import { soundFX } from '../utils/soundFX';

export const Footer: React.FC = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [easterEggOpen, setEasterEggOpen] = useState(false);

  // Easter egg click combo counter
  const [clickCount, setClickCount] = useState(0);
  const [comboHint, setComboHint] = useState<string | null>(null);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoComboClick = (e: React.MouseEvent) => {
    e.preventDefault();
    soundFX.playClick();

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (newCount >= 3) {
      setComboHint('✨ ¡COMBO DESBLOQUEADO! Cargando Matriz 3D...');
      setClickCount(0);
      setTimeout(() => {
        setComboHint(null);
        setEasterEggOpen(true);
      }, 400);
    } else {
      setComboHint(`✨ Clic ${newCount}/3 para el Huevo de Pascua 3D`);
      clickTimerRef.current = setTimeout(() => {
        setClickCount(0);
        setComboHint(null);
      }, 2000);
    }
  };

  const scrollToTop = () => {
    soundFX.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (id: string) => {
    soundFX.playClick();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#070914] text-slate-400 py-16 border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Closing Quote (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            {/* Interactive Logo with 3-Click Easter Egg Combo */}
            <div className="relative w-fit">
              <a
                href="#"
                onClick={handleLogoComboClick}
                title="Haz 3 clics rápidos para desbloquear el Huevo de Pascua 3D"
                className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white group w-fit cursor-pointer select-none"
              >
                <span className="w-3 h-3 rounded-full bg-[#EC9731] group-hover:scale-125 transition-transform duration-300 shadow-[0_0_12px_#EC9731]" />
                <span>TECNOVA</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded text-[#EC9731] bg-[#314595]/30 border border-[#314595]/50 group-hover:border-[#EC9731]">
                  WEB STUDIO
                </span>
              </a>

              {/* Secret Combo Hint Notification */}
              {comboHint && (
                <div className="absolute top-full left-0 mt-2 px-3 py-1 rounded-full bg-[#EC9731] text-white text-[10px] font-mono font-bold animate-bounce shadow-lg whitespace-nowrap z-20">
                  {comboHint}
                </div>
              )}
            </div>

            <p className="text-sm text-slate-300 italic max-w-sm">
              "Building digital experiences. Creating what comes next."
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Desarrollo web de alto nivel, interfaces UI/UX sofisticadas y soluciones digitales a medida para marcas con visión de futuro.
            </p>
          </div>

          {/* Quick Navigation Links (3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-2">
              NAVEGACIÓN
            </h4>
            <button
              onClick={() => handleNavClick('about')}
              className="text-xs text-slate-400 hover:text-[#EC9731] transition-colors text-left cursor-pointer"
            >
              Sobre Mí
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className="text-xs text-slate-400 hover:text-[#EC9731] transition-colors text-left cursor-pointer"
            >
              Servicios
            </button>
            <button
              onClick={() => handleNavClick('tech-stack')}
              className="text-xs text-slate-400 hover:text-[#EC9731] transition-colors text-left cursor-pointer"
            >
              Tech Stack
            </button>
            <button
              onClick={() => handleNavClick('projects')}
              className="text-xs text-slate-400 hover:text-[#EC9731] transition-colors text-left cursor-pointer"
            >
              Proyectos Seleccionados
            </button>
            <button
              onClick={() => handleNavClick('process')}
              className="text-xs text-slate-400 hover:text-[#EC9731] transition-colors text-left cursor-pointer"
            >
              Metodología de Trabajo
            </button>
          </div>

          {/* Social Channels & Back to Top (4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-4 items-start md:items-end justify-between">
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-3 md:text-right">
                REDES PROFESIONALES
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Perfil de GitHub"
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-[#314595] transition-all cursor-pointer"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Perfil de LinkedIn"
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-[#314595] transition-all cursor-pointer"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="mailto:contacto@aurastudio.dev"
                  aria-label="Enviar correo"
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-[#314595] transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-300 hover:text-[#EC9731] transition-colors cursor-pointer group"
            >
              <span>VOLVER ARRIBA</span>
              <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#EC9731] group-hover:text-white transition-all">
                <ArrowUp className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal & Easter Egg trigger button */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <p>© {new Date().getFullYear()} TECNOVA WEB STUDIO. Todos los derechos reservados.</p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                soundFX.playClick();
                setPrivacyOpen(true);
              }}
              className="hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
            >
              Política de Privacidad
            </button>
            <span className="text-slate-700">·</span>
            
            {/* Direct Secret Trigger Button */}
            <button
              onClick={() => {
                soundFX.playClick();
                setEasterEggOpen(true);
              }}
              className="text-[#EC9731] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer group"
              title="Abrir Huevo de Pascua 3D"
            >
              <Sparkles className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
              <span className="underline underline-offset-4">3D Core Easter Egg</span>
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />

      {/* 3D Easter Egg Canvas Modal */}
      <Aura3DEasterEgg isOpen={easterEggOpen} onClose={() => setEasterEggOpen(false)} />
    </footer>
  );
};
