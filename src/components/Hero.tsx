import React from 'react';
import { ChevronRight, MessageSquare } from 'lucide-react';
import { InteractiveRobot } from './InteractiveRobot';
import { soundFX } from '../utils/soundFX';

interface HeroProps {
  onOpenContact: () => void;
  onOpenChat?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact, onOpenChat }) => {
  const scrollTo = (id: string) => {
    soundFX.playClick();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center pt-24 sm:pt-28 pb-12 overflow-hidden bg-[#0b0e1b]">
      {/* Hero Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
        Tu navegador no soporta videos.
      </video>
      <div className="absolute inset-0 bg-[#0b0e1b]/70 z-0" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full flex flex-col items-center justify-between min-h-[calc(100vh-130px)]">
        {/* Central Typographic Message with Interactive Robot Peeking Over */}
        <div className="relative max-w-4xl mx-auto text-center my-auto pt-8 sm:pt-10 pb-6 flex flex-col items-center">
          {/* 🤖 Interactive Robot Ro-Bot Peeking with hands at the text level */}
          <div className="relative z-20 pointer-events-auto transition-transform hover:scale-105 -mb-6 sm:-mb-8 md:-mb-10">
            <InteractiveRobot onOpenChat={onOpenChat} />
          </div>

          {/* Main Headline */}
          <h1 className="relative z-10 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6 text-balance">
            Transformamos ideas en{' '}
            <span className="text-[#EC9731]">experiencias digitales</span>{' '}
            extraordinarias.
          </h1>

          {/* Description */}
          <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto mb-10 text-balance">
            Diseño y desarrollo soluciones web modernas, funcionales y escalables que ayudan a marcas y negocios a destacar en el mundo digital.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo('projects')}
              onMouseEnter={() => soundFX.playHover()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#314595] hover:bg-[#223488] border border-[#314595] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Explorar proyectos</span>
              <ChevronRight className="w-4 h-4 text-[#EC9731]" />
            </button>

            <button
              onClick={() => {
                if (onOpenContact) onOpenContact();
                else scrollTo('contact');
              }}
              onMouseEnter={() => soundFX.playHover()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-200 bg-[#10152b] hover:bg-[#161d3a] border border-white/15 hover:border-[#EC9731]/60 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Hablemos de tu proyecto</span>
            </button>

            {onOpenChat && (
              <button
                onClick={() => {
                  soundFX.playClick();
                  onOpenChat();
                }}
                onMouseEnter={() => soundFX.playHover()}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#10152b] hover:bg-[#161d3a] border border-[#EC9731]/40 hover:border-[#EC9731] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group"
              >
                <MessageSquare className="w-4 h-4 text-[#EC9731] group-hover:scale-110 transition-transform" />
                <span>Hablar con Ro-Bot</span>
              </button>
            )}
          </div>
        </div>

        {/* Minimalist Bottom Scroll Cue */}
        <div className="w-full flex justify-center pb-2 pt-2">
          <button
            onClick={() => scrollTo('about')}
            onMouseEnter={() => soundFX.playHover()}
            aria-label="Desplazarse a la sección sobre mí"
            className="flex flex-col items-center gap-2 text-slate-400 hover:text-[#EC9731] transition-colors cursor-pointer group"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 group-hover:text-slate-200">
              EXPLORAR
            </span>
            <div className="w-5 h-8 rounded-full border border-white/20 group-hover:border-[#EC9731] flex items-start justify-center p-1 transition-colors">
              <div className="w-1 h-2 bg-[#EC9731] rounded-full animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
