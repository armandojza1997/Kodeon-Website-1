import React, { useState, useRef, useEffect } from 'react';
import { Send, X, RotateCcw, Bot, Sparkles, ChevronRight, MessageSquare, Terminal, ExternalLink } from 'lucide-react';
import { soundFX } from '../utils/soundFX';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface RoBotChatProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'model',
    content: '¡Hola! Soy **Ro-Bot**, el asistente interactivo de este portfolio. *beep boop* 🤖\n\nPuedo resolver tus dudas sobre **servicios de desarrollo web**, el **stack tecnológico** (React, TypeScript, Node.js, etc.), **proyectos destacados** o ayudarte a estimar el presupuesto de tu idea. ¿En qué te puedo ayudar hoy?',
    timestamp: 'Ahora'
  }
];

const SUGGESTIONS = [
  { label: '¿Qué servicios ofreces?', query: '¿Cuáles son los principales servicios de desarrollo web que ofreces?' },
  { label: 'Tech Stack', query: '¿Qué tecnologías, frameworks y herramientas utilizas?' },
  { label: 'Ver Proyectos', query: 'Cuéntame sobre los proyectos destacados de tu portfolio' },
  { label: 'Estimar presupuesto', query: '¿Cómo puedo estimar el costo de mi proyecto web?' },
  { label: 'Iniciar contacto', query: 'Quiero contactar al desarrollador para una propuesta' }
];

export const RoBotChat: React.FC<RoBotChatProps> = ({ isOpen, onClose, onOpen }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setHasUnread(false);
      // Focus input on open
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    soundFX.playClick();
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          message: text
        })
      });

      const data = await response.json();
      const replyContent = data.reply || '¡Recibido! *beep* Estoy procesando tus requerimientos.';

      const botMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        role: 'model',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      soundFX.playSuccess();
      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (err) {
      console.error('Chatbot error:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-fallback-${Date.now()}`,
        role: 'model',
        content: '¡Hola! *beep* Como Ro-Bot puedo indicarte que puedes explorar los servicios en la sección correspondiente o enviarnos un mensaje directo en la sección de Contacto para recibir una propuesta en menos de 24 horas.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    soundFX.playClick();
    setMessages(INITIAL_MESSAGES);
  };

  const scrollToSection = (id: string) => {
    soundFX.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Floating Trigger Button (when chat is closed) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          {/* Ambient speech pill */}
          <button
            onClick={() => {
              soundFX.playClick();
              onOpen();
            }}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#10152b]/95 border border-[#EC9731]/50 text-white text-xs font-medium shadow-xl hover:border-[#EC9731] transition-all cursor-pointer group"
          >
            <span className="w-2 h-2 rounded-full bg-[#EC9731] animate-ping" />
            <span className="text-slate-300 group-hover:text-white transition-colors">
              ¿Dudas? <strong className="text-[#EC9731] font-semibold">Chatea con Ro-Bot</strong>
            </span>
          </button>

          {/* Icon Button */}
          <button
            onClick={() => {
              soundFX.playClick();
              onOpen();
            }}
            aria-label="Abrir chat con Ro-Bot"
            className="relative w-14 h-14 rounded-2xl bg-[#10152b] hover:bg-[#161d3a] border-2 border-[#314595] hover:border-[#EC9731] transition-all flex items-center justify-center shadow-2xl cursor-pointer group hover:scale-105"
          >
            {/* Pulsing indicator ring */}
            <span className="absolute -inset-1 rounded-2xl bg-[#EC9731]/20 blur-sm group-hover:bg-[#EC9731]/40 transition-all" />

            {/* Mini Ro-Bot SVG Face */}
            <div className="relative z-10 w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
                {/* Antenna */}
                <line x1="20" y1="8" x2="20" y2="3" stroke="#314595" strokeWidth="2" />
                <circle cx="20" cy="3" r="2.5" fill="#EC9731" className="animate-pulse" />
                {/* Head */}
                <rect x="6" y="8" width="28" height="26" rx="6" fill="#10152b" stroke="#314595" strokeWidth="2" />
                {/* Visor */}
                <rect x="10" y="13" width="20" height="12" rx="3" fill="#060913" stroke="#223488" strokeWidth="1.5" />
                {/* Eyes */}
                <circle cx="16" cy="19" r="2.5" fill="#EC9731" />
                <circle cx="24" cy="19" r="2.5" fill="#EC9731" />
                {/* Mouth indicator */}
                <line x1="17" y1="29" x2="23" y2="29" stroke="#314595" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Unread badge */}
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#EC9731] border-2 border-[#0b0e1b] animate-bounce" />
            )}
          </button>
        </div>
      )}

      {/* Ro-Bot Chat Panel Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[420px] max-w-[420px] h-[580px] max-h-[85vh] rounded-2xl bg-[#0c1022] border border-[#314595]/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#10152b] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Ro-Bot Avatar */}
              <div className="relative w-10 h-10 rounded-xl bg-[#0b0e1b] border border-[#314595] flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
                  <line x1="20" y1="8" x2="20" y2="3" stroke="#314595" strokeWidth="2" />
                  <circle cx="20" cy="3" r="2.5" fill="#EC9731" />
                  <rect x="6" y="8" width="28" height="26" rx="6" fill="#10152b" stroke="#314595" strokeWidth="2" />
                  <rect x="10" y="13" width="20" height="12" rx="3" fill="#060913" stroke="#223488" strokeWidth="1.5" />
                  <circle cx="16" cy="19" r="2.5" fill="#EC9731" />
                  <circle cx="24" cy="19" r="2.5" fill="#EC9731" />
                  <line x1="17" y1="29" x2="23" y2="29" stroke="#314595" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#10152b]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white tracking-wide">Ro-Bot</h3>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#314595]/50 border border-[#314595] text-slate-300">
                    Asistente IA
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-normal flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EC9731] animate-ping" />
                  En línea • Conectado a AURA
                </p>
              </div>
            </div>

            {/* Header controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Reiniciar conversación"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  soundFX.playClick();
                  onClose();
                }}
                title="Cerrar chat"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Shortcuts Suggestions (Top Ribbon) */}
          <div className="px-3 py-2 bg-[#0e1329] border-b border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.query)}
                disabled={isLoading}
                className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-[#161d3a] hover:bg-[#223488] text-slate-300 hover:text-white border border-white/10 hover:border-[#EC9731]/60 transition-colors cursor-pointer disabled:opacity-50"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-lg bg-[#10152b] border border-[#314595] flex-shrink-0 flex items-center justify-center text-[#EC9731] text-[10px] font-bold">
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#314595] text-white rounded-tr-none'
                      : 'bg-[#121833] text-slate-200 border border-white/10 rounded-tl-none'
                  }`}
                >
                  {/* Message formatted content */}
                  <div className="whitespace-pre-line text-[13px]">
                    {msg.content.split('\n').map((paragraph, pIdx) => {
                      if (!paragraph) return <div key={pIdx} className="h-1.5" />;

                      // Render bold text
                      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={pIdx} className="mb-1 last:mb-0">
                          {parts.map((part, partIdx) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return (
                                <strong key={partIdx} className="font-semibold text-white">
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            }
                            return part;
                          })}
                        </p>
                      );
                    })}
                  </div>

                  {/* Contextual Action Buttons in Ro-Bot response */}
                  {msg.role === 'model' && (
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                      {msg.content.toLowerCase().includes('proyecto') && (
                        <button
                          onClick={() => scrollToSection('projects')}
                          className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-[#314595]/40 hover:bg-[#314595] text-slate-200 hover:text-white border border-[#314595] transition-colors cursor-pointer"
                        >
                          <span>Ver Proyectos</span>
                          <ExternalLink className="w-3 h-3 text-[#EC9731]" />
                        </button>
                      )}
                      {(msg.content.toLowerCase().includes('contacto') || msg.content.toLowerCase().includes('presupuesto') || msg.content.toLowerCase().includes('estimar')) && (
                        <button
                          onClick={() => scrollToSection('contact')}
                          className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-[#EC9731]/20 hover:bg-[#EC9731] text-[#EC9731] hover:text-[#0b0e1b] font-medium border border-[#EC9731]/40 transition-colors cursor-pointer"
                        >
                          <span>Ir al Contacto / Estimador</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.role === 'user' ? 'text-white/60' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-[#10152b] border border-[#314595] flex-shrink-0 flex items-center justify-center text-[#EC9731] text-[10px]">
                  🤖
                </div>
                <div className="bg-[#121833] border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-mono mr-1">Ro-Bot procesando</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EC9731] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EC9731] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EC9731] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Footer */}
          <div className="p-3 bg-[#10152b] border-t border-white/10">
            <div className="flex items-center gap-2 bg-[#090d1c] border border-white/15 focus-within:border-[#EC9731] rounded-xl px-3 py-2 transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe un mensaje para Ro-Bot..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                aria-label="Enviar mensaje"
                className="w-8 h-8 rounded-lg bg-[#314595] hover:bg-[#223488] disabled:opacity-40 disabled:hover:bg-[#314595] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#EC9731]" />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-2 font-mono">
              Ro-Bot responde usando IA y conoce todo sobre la trayectoria de AURA.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
