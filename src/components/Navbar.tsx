import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowUpRight, Bot, Sun, Moon, Lock } from 'lucide-react';
import { soundFX } from '../utils/soundFX';
import logoImg from '../assets/images/Logo.png';

interface NavbarProps {
  onOpenContact: () => void;
  onOpenChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact, onOpenChat }) => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(soundFX.getMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(() => {
    try {
      return localStorage.getItem('codix_theme') === 'light';
    } catch {
      return false;
    }
  });
  
  // Theme management effect
  useEffect(() => {
    try {
      localStorage.setItem('codix_theme', isLightMode ? 'light' : 'dark');
      if (isLightMode) {
        document.documentElement.classList.add('light-theme');
      } else {
        document.documentElement.classList.remove('light-theme');
      }
    } catch {
      // ignore
    }
  }, [isLightMode]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 40);
      setScrollProgress(totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    soundFX.playClick();
    setIsLightMode(!isLightMode);
  };

  const toggleSound = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFX.playClick();
  };

  const handleNavClick = (id: string) => {
    soundFX.playClick();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-[#0b0e1b] border-b border-white/10 ${
          scrolled ? 'py-3 shadow-xl shadow-black/50' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">
          {/* Zone 1: Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onMouseEnter={() => soundFX.playHover()}
            aria-label="Códix - Inicio"
            className="flex items-center group shrink-0 cursor-pointer"
          >
            <img
              src={logoImg}
              alt="Códix Logo"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/Logo.png';
              }}
              className="h-10 sm:h-12 w-auto max-w-[220px] object-contain transition-transform group-hover:scale-105 drop-shadow-[0_0_15px_rgba(236,151,49,0.35)]"
            />
          </a>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNavClick('about')}
              onMouseEnter={() => soundFX.playHover()}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sobre Mí
            </button>
            <button
              onClick={() => handleNavClick('services')}
              onMouseEnter={() => soundFX.playHover()}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Servicios
            </button>
            <button
              onClick={() => handleNavClick('tech-stack')}
              onMouseEnter={() => soundFX.playHover()}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Tech Stack
            </button>
            <button
              onClick={() => handleNavClick('projects')}
              onMouseEnter={() => soundFX.playHover()}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Proyectos
            </button>
            <button
              onClick={() => handleNavClick('process')}
              onMouseEnter={() => soundFX.playHover()}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Metodología
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {onOpenChat && (
              <button
                onClick={() => {
                  soundFX.playClick();
                  onOpenChat();
                }}
                aria-label="Abrir chat con Ro-Bot"
                title="Ro-Bot • Asistente IA"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10152b] hover:bg-[#161d3a] border border-[#EC9731]/40 hover:border-[#EC9731] text-xs font-mono text-slate-200 transition-all cursor-pointer shadow-sm group"
              >
                <Bot className="w-3.5 h-3.5 text-[#EC9731] group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline font-medium">Ro-Bot</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </button>
            )}

            <button
              onClick={toggleTheme}
              aria-label={isLightMode ? 'Activar modo oscuro' : 'Activar modo claro'}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              title={isLightMode ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
            >
              {isLightMode ? <Moon className="w-4 h-4 text-[#EC9731]" /> : <Sun className="w-4 h-4 text-[#EC9731]" />}
            </button>

            <button
              onClick={toggleSound}
              aria-label={isMuted ? 'Activar sonido FX' : 'Silenciar sonido FX'}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              title={isMuted ? 'Sonido desactivado' : 'Sonido activado'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#EC9731]" />}
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                handleNavClick('contact');
              }}
              onMouseEnter={() => soundFX.playHover()}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#314595] hover:bg-[#EC9731] rounded-full border border-white/20 transition-all duration-300 shadow-lg whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Contacto</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => {
                soundFX.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              aria-label="Abrir menú de navegación"
              className="md:hidden p-2 text-slate-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-[#EC9731] transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#0b0e1b]/95 backdrop-blur-xl pt-24 px-6 md:hidden flex flex-col justify-between pb-10 animate-fadeIn">
          <nav className="flex flex-col gap-6 text-xl font-bold text-slate-200">
            <button
              onClick={() => handleNavClick('about')}
              className="text-left py-2 border-b border-white/10 hover:text-[#EC9731] transition-colors"
            >
              01. Sobre Mí
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className="text-left py-2 border-b border-white/10 hover:text-[#EC9731] transition-colors"
            >
              02. Servicios
            </button>
            <button
              onClick={() => handleNavClick('tech-stack')}
              className="text-left py-2 border-b border-white/10 hover:text-[#EC9731] transition-colors"
            >
              03. Tech Stack
            </button>
            <button
              onClick={() => handleNavClick('projects')}
              className="text-left py-2 border-b border-white/10 hover:text-[#EC9731] transition-colors"
            >
              04. Proyectos
            </button>
            <button
              onClick={() => handleNavClick('process')}
              className="text-left py-2 border-b border-white/10 hover:text-[#EC9731] transition-colors"
            >
              05. Metodología
            </button>
          </nav>

          <div className="flex flex-col gap-3">
            {onOpenChat && (
              <button
                onClick={() => {
                  soundFX.playClick();
                  setMobileMenuOpen(false);
                  onOpenChat();
                }}
                className="w-full py-3 text-center text-xs font-mono uppercase tracking-wider text-white bg-[#10152b] hover:bg-[#161d3a] border border-[#EC9731]/70 rounded-full flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Bot className="w-4 h-4 text-[#EC9731]" />
                <span>Chatear con Ro-Bot (IA)</span>
              </button>
            )}

            <button
              onClick={() => {
                handleNavClick('contact');
              }}
              className="w-full py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white bg-[#EC9731] hover:bg-[#d68525] rounded-full shadow-lg cursor-pointer"
            >
              Iniciar un Proyecto
            </button>
            <p className="text-center text-xs text-slate-500 font-mono">
              CÓDIX DIGITAL STUDIO © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
