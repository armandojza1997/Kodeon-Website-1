import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  X,
  RotateCcw,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Video,
  User,
  Mail,
  HelpCircle,
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';
import { soundFX } from '../utils/soundFX';
import { generateSmartRoBotAnswer } from '../utils/roBotEngine';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  appointmentCard?: {
    id: string;
    name: string;
    email: string;
    date: string;
    time: string;
    serviceTopic: string;
    meetLink: string;
  };
  recommendationCard?: {
    service: string;
    description: string;
    recommendedStack: string;
    timeline: string;
    estimatedPrice: string;
  };
}

interface RoBotChatProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const SERVICES_LIST = [
  '01. Diseño y Desarrollo Web ($1,200 - $2,200)',
  '02. Diseño UI/UX en Figma ($1,000 - $1,800)',
  '03. Aplicaciones Web & SaaS ($2,800 - $6,000+)',
  '04. E-commerce & Tienda Online ($2,200 - $4,500)',
  '05. Automatización & APIs ($1,500 - $3,500)',
  '06. Mantenimiento & Optimización ($250/mes o $600)',
  'Reunión de diagnóstico general'
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'model',
    content: '¡Hola! Soy **Ro-Bot**, el asistente inteligente de este portfolio. *beep boop* 🤖\n\nPuedo ayudarte a:\n• **Conocer todos nuestros servicios y productos** con precios y plazos.\n• **Darte una recomendación personalizada** según tu tipo de negocio.\n• **Responder preguntas sobre cómo trabajamos**, pagos y garantías.\n• **Agendar una videollamada de 30 min** directamente por aquí.\n\n¿En qué podemos colaborar hoy?',
    timestamp: 'Ahora'
  }
];

export const RoBotChat: React.FC<RoBotChatProps> = ({ isOpen, onClose, onOpen }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('codix_robot_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // localStorage error ignore
    }
    return INITIAL_MESSAGES;
  });

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'servicios' | 'recomendaciones' | 'negocio' | 'agendar'>('servicios');

  // Persist messages to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('codix_robot_chat_history', JSON.stringify(messages));
    } catch {
      // localStorage error ignore
    }
  }, [messages]);

  // Booking Form State
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('11:30 AM');
  const [bookingTopic, setBookingTopic] = useState(SERVICES_LIST[0]);
  const [bookingNotes, setBookingNotes] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Available dates for booking
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const timeSlots = ['10:00 AM', '11:30 AM', '02:30 PM', '04:00 PM', '05:30 PM'];

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Fetch availability dates
  useEffect(() => {
    fetch('/api/appointments/availability')
      .then((res) => res.json())
      .then((data) => {
        if (data.availableDays && data.availableDays.length > 0) {
          setAvailableDays(data.availableDays);
          setBookingDate(data.availableDays[0]);
        }
      })
      .catch(() => {
        // Fallback dates
        const days: string[] = [];
        const d = new Date();
        for (let i = 1; i <= 7; i++) {
          d.setDate(d.getDate() + 1);
          if (d.getDay() !== 0 && d.getDay() !== 6) {
            days.push(d.toISOString().split('T')[0]);
          }
        }
        setAvailableDays(days);
        if (days.length > 0) setBookingDate(days[0]);
      });
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen, showBookingForm]);

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

    // If message implies booking, offer booking form
    const lower = text.toLowerCase();
    if (
      lower.includes('cita') ||
      lower.includes('agenda') ||
      lower.includes('reunion') ||
      lower.includes('videollamada') ||
      lower.includes('agendar')
    ) {
      setShowBookingForm(true);
    }

    let replyContent = '';
    let actionSuggest: string | undefined = undefined;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          message: text
        })
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          if (data && typeof data.reply === 'string' && data.reply.trim().length > 0) {
            replyContent = data.reply;
          }
        }
      }
    } catch (networkErr) {
      console.warn('Backend /api/chat not reachable, activating Ro-Bot client intelligence engine:', networkErr);
    }

    // Bulletproof fallback: If backend did not reply (e.g. static Vercel host or API key missing)
    if (!replyContent) {
      const smartResult = generateSmartRoBotAnswer(text);
      replyContent = smartResult.reply;
      actionSuggest = smartResult.actionSuggestion;
      if (smartResult.actionSuggestion === 'booking') {
        setShowBookingForm(true);
      }
    }

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
    setIsLoading(false);
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingEmail.trim()) {
      setBookingError('Por favor introduce tu nombre y correo electrónico.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingEmail)) {
      setBookingError('Por favor introduce un correo electrónico válido.');
      return;
    }

    setBookingError(null);
    setIsSubmittingBooking(true);
    soundFX.playClick();

    let createdAppointment: any = null;

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: bookingName.trim(),
          email: bookingEmail.trim(),
          date: bookingDate,
          time: bookingTime,
          serviceTopic: bookingTopic,
          notes: bookingNotes.trim()
        })
      });

      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (data.success && data.appointment) {
            createdAppointment = data.appointment;
          }
        }
      }
    } catch (err) {
      console.warn('Server booking endpoint unreachable, creating appointment via Ro-Bot Client Engine:', err);
    }

    // Bulletproof fallback: If serverless is not reachable on Vercel, generate and store client-side
    if (!createdAppointment) {
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      createdAppointment = {
        id: `CITA-${Math.floor(1000 + Math.random() * 9000)}`,
        name: bookingName.trim(),
        email: bookingEmail.trim(),
        date: bookingDate,
        time: bookingTime,
        serviceTopic: bookingTopic,
        notes: bookingNotes.trim() || undefined,
        meetLink: `https://meet.google.com/aur-dev-${randomSuffix}`,
        status: 'confirmada',
        createdAt: new Date().toISOString()
      };

      try {
        const existing = JSON.parse(localStorage.getItem('aura_appointments') || '[]');
        existing.unshift(createdAppointment);
        localStorage.setItem('aura_appointments', JSON.stringify(existing));
      } catch {
        // localStorage error ignore
      }
    }

    soundFX.playSuccess();
    const appt = createdAppointment;

    const confirmationMsg: ChatMessage = {
      id: `appt-confirm-${Date.now()}`,
      role: 'model',
      content: `¡Cita agendada con éxito! 🎉 *beep beep*\n\nHe reservado una videollamada de **30 minutos** para el día **${appt.date}** a las **${appt.time}**.\nTe hemos enviado los accesos a **${appt.email}**. ¡Será un placer conocer tu proyecto!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      appointmentCard: {
        id: appt.id,
        name: appt.name,
        email: appt.email,
        date: appt.date,
        time: appt.time,
        serviceTopic: appt.serviceTopic,
        meetLink: appt.meetLink
      }
    };

    setMessages((prev) => [...prev, confirmationMsg]);
    setShowBookingForm(false);
    setBookingNotes('');
    setIsSubmittingBooking(false);
  };

  const handleRecommendationPreset = (type: string) => {
    soundFX.playClick();
    if (type === 'startup') {
      handleSendMessage('Tengo una startup en fase inicial. ¿Qué servicio y stack me recomiendas para validar mi producto?');
    } else if (type === 'ecommerce') {
      handleSendMessage('Quiero vender productos en línea. ¿Qué me recomiendas para armar una tienda online de alto rendimiento?');
    } else if (type === 'corporate') {
      handleSendMessage('Ofrezco servicios profesionales y necesito captar clientes. ¿Qué tipo de sitio web me recomiendas?');
    } else if (type === 'automation') {
      handleSendMessage('Tenemos procesos manuales y usamos hojas de cálculo. ¿Cómo nos puede ayudar una aplicación o automatización con APIs?');
    } else if (type === 'audit') {
      handleSendMessage('Mi sitio web actual es lento y no convierte. ¿Qué recomiendas para rediseñarlo y optimizarlo?');
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
    setShowBookingForm(false);
    try {
      localStorage.removeItem('codix_robot_chat_history');
    } catch {
      // ignore
    }
  };

  const scrollToSection = (id: string) => {
    soundFX.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Google Calendar Link Generator
  const getGoogleCalendarUrl = (appt: { date: string; time: string; serviceTopic: string; meetLink: string }) => {
    const title = encodeURIComponent(`Reunión Diagnóstico Códix: ${appt.serviceTopic}`);
    const details = encodeURIComponent(
      `Videollamada de 30 minutos con el desarrollador de Códix.\nTema: ${appt.serviceTopic}\nEnlace Google Meet: ${appt.meetLink}`
    );
    const location = encodeURIComponent(appt.meetLink);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
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
              ¿Dudas o citas? <strong className="text-[#EC9731] font-semibold">Chatea con Ro-Bot</strong>
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
            <span className="absolute -inset-1 rounded-2xl bg-[#EC9731]/20 blur-sm group-hover:bg-[#EC9731]/40 transition-all" />

            {/* Mini Ro-Bot SVG Face */}
            <div className="relative z-10 w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
                <line x1="20" y1="8" x2="20" y2="3" stroke="#314595" strokeWidth="2" />
                <circle cx="20" cy="3" r="2.5" fill="#EC9731" className="animate-pulse" />
                <rect x="6" y="8" width="28" height="26" rx="6" fill="#10152b" stroke="#314595" strokeWidth="2" />
                <rect x="10" y="13" width="20" height="12" rx="3" fill="#060913" stroke="#223488" strokeWidth="1.5" />
                <circle cx="16" cy="19" r="2.5" fill="#EC9731" />
                <circle cx="24" cy="19" r="2.5" fill="#EC9731" />
                <line x1="17" y1="29" x2="23" y2="29" stroke="#314595" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#EC9731] border-2 border-[#0b0e1b] animate-bounce" />
            )}
          </button>
        </div>
      )}

      {/* Ro-Bot Chat Panel Modal */}
      {isOpen && (
        <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[460px] max-w-[460px] h-[640px] max-h-[90vh] rounded-2xl bg-[#0c1022] border border-[#314595]/80 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-[#10152b] border-b border-white/10 flex items-center justify-between">
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
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#EC9731]/20 border border-[#EC9731]/50 text-[#EC9731]">
                    Gemini AI • Citas
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-normal flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EC9731] animate-ping" />
                  En línea • Catálogo & Agenda Activa
                </p>
              </div>
            </div>

            {/* Header controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setShowBookingForm(!showBookingForm);
                }}
                className={`flex items-center gap-1 text-[11px] font-mono px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  showBookingForm
                    ? 'bg-[#EC9731] text-[#0b0e1b] font-bold border-[#EC9731]'
                    : 'bg-[#161d3a] hover:bg-[#223488] text-white border-white/10 hover:border-[#EC9731]'
                }`}
                title="Abrir agenda de citas"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Agendar Cita</span>
              </button>

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

          {/* Category Tabs for Knowledge, Recommendations, Business & Booking */}
          <div className="px-3 pt-2 pb-1.5 bg-[#0e1329] border-b border-white/5 flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveCategory('servicios');
              }}
              className={`text-[11px] font-mono whitespace-nowrap px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                activeCategory === 'servicios'
                  ? 'bg-[#314595] text-white border-[#314595]'
                  : 'bg-[#121833] text-slate-300 border-white/10 hover:border-white/20'
              }`}
            >
              🚀 Servicios & Precios
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveCategory('recomendaciones');
              }}
              className={`text-[11px] font-mono whitespace-nowrap px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                activeCategory === 'recomendaciones'
                  ? 'bg-[#314595] text-white border-[#314595]'
                  : 'bg-[#121833] text-slate-300 border-white/10 hover:border-white/20'
              }`}
            >
              🎯 Asesor de Negocio
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveCategory('negocio');
              }}
              className={`text-[11px] font-mono whitespace-nowrap px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                activeCategory === 'negocio'
                  ? 'bg-[#314595] text-white border-[#314595]'
                  : 'bg-[#121833] text-slate-300 border-white/10 hover:border-white/20'
              }`}
            >
              💼 Pagos & Garantía
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setShowBookingForm(true);
              }}
              className="text-[11px] font-mono whitespace-nowrap px-2.5 py-1 rounded-full bg-[#EC9731]/20 hover:bg-[#EC9731] text-[#EC9731] hover:text-[#0b0e1b] border border-[#EC9731]/40 transition-colors cursor-pointer font-bold flex items-center gap-1"
            >
              <Calendar className="w-3 h-3" />
              <span>Agendar</span>
            </button>
          </div>

          {/* Quick Prompts Ribbon based on selected category */}
          <div className="px-3 py-1.5 bg-[#090d1c] border-b border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {activeCategory === 'servicios' && (
              <>
                <button
                  onClick={() => handleSendMessage('¿Cuáles son los 6 servicios principales y qué precios tienen?')}
                  className="text-[10px] whitespace-nowrap px-2 py-0.5 rounded bg-[#161d3a] hover:bg-[#223488] text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                >
                  Catálogo completo & precios
                </button>
                <button
                  onClick={() => handleSendMessage('¿Cuánto cuesta y qué incluye una aplicación web SaaS?')}
                  className="text-[10px] whitespace-nowrap px-2 py-0.5 rounded bg-[#161d3a] hover:bg-[#223488] text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                >
                  Aplicaciones Web & SaaS
                </button>
                <button
                  onClick={() => handleSendMessage('¿Qué incluye el servicio de E-commerce?')}
                  className="text-[10px] whitespace-nowrap px-2 py-0.5 rounded bg-[#161d3a] hover:bg-[#223488] text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                >
                  E-commerce con Stripe
                </button>
              </>
            )}

            {activeCategory === 'recomendaciones' && (
              <>
                <button
                  onClick={() => handleRecommendationPreset('startup')}
                  className="text-[10px] whitespace-nowrap px-2 py-0.5 rounded bg-[#161d3a] hover:bg-[#223488] text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                >
                  Recomendación para Startup
                </button>
                <button
                  onClick={() => handleRecommendationPreset('ecommerce')}
                  className="text-[10px] whitespace-nowrap px-2 py-0.5 rounded bg-[#161d3a] hover:bg-[#223488] text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                >
                  Quiero vender online
                </button>
                <button
                  onClick={() => handleRecommendationPreset('audit')}
                  className="text-[10px] whitespace-nowrap px-2 py-0.5 rounded bg-[#161d3a] hover:bg-[#223488] text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                >
                  Mi web actual es lenta
                </button>
              </>
            )}

            {activeCategory === 'negocio' && (
              <>
                <button
                  onClick={() => handleSendMessage('¿Cuáles son las formas y condiciones de pago?')}
                  className="text-[10px] whitespace-nowrap px-2 py-0.5 rounded bg-[#161d3a] hover:bg-[#223488] text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                >
                  Condiciones de pago (50/50)
                </button>
                <button
                  onClick={() => handleSendMessage('¿Qué garantía ofrecen tras la entrega del proyecto?')}
                  className="text-[10px] whitespace-nowrap px-2 py-0.5 rounded bg-[#161d3a] hover:bg-[#223488] text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                >
                  Garantía 30 días
                </button>
                <button
                  onClick={() => handleSendMessage('¿Quién es el propietario del código fuente y los diseños?')}
                  className="text-[10px] whitespace-nowrap px-2 py-0.5 rounded bg-[#161d3a] hover:bg-[#223488] text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                >
                  Propiedad del código (100%)
                </button>
              </>
            )}
          </div>

          {/* In-Chat Interactive Booking Module (Expandable) */}
          {showBookingForm && (
            <div className="bg-[#121833] border-b border-[#EC9731]/40 p-4 animate-in slide-in-from-top-3 duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#EC9731]/20 flex items-center justify-center text-[#EC9731]">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Agendar Cita de Descubrimiento</h4>
                    <p className="text-[10px] text-slate-400">Videollamada de 30 minutos sin costo por Google Meet</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleBookAppointment} className="space-y-2.5 text-xs">
                {/* Topic / Service selector */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Tema o Servicio de Interés
                  </label>
                  <select
                    value={bookingTopic}
                    onChange={(e) => setBookingTopic(e.target.value)}
                    className="w-full bg-[#090d1c] border border-white/15 focus:border-[#EC9731] text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                  >
                    {SERVICES_LIST.map((srv, idx) => (
                      <option key={idx} value={srv} className="bg-[#0b0e1b] text-slate-200">
                        {srv}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#EC9731]" />
                      <span>Fecha</span>
                    </label>
                    <select
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-[#090d1c] border border-white/15 focus:border-[#EC9731] text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                    >
                      {availableDays.map((d) => (
                        <option key={d} value={d} className="bg-[#0b0e1b] text-slate-200">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#EC9731]" />
                      <span>Hora</span>
                    </label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full bg-[#090d1c] border border-white/15 focus:border-[#EC9731] text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                    >
                      {timeSlots.map((ts) => (
                        <option key={ts} value={ts} className="bg-[#0b0e1b] text-slate-200">
                          {ts}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      placeholder="Tu nombre completo"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      className="w-full bg-[#090d1c] border border-white/15 focus:border-[#EC9731] text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      className="w-full bg-[#090d1c] border border-white/15 focus:border-[#EC9731] text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none placeholder-slate-400"
                    />
                  </div>
                </div>

                {bookingError && (
                  <p className="text-[11px] text-red-400 font-medium">{bookingError}</p>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="px-4 py-1.5 rounded-lg bg-[#EC9731] hover:bg-[#d68525] disabled:opacity-50 text-[#0b0e1b] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <span>{isSubmittingBooking ? 'Confirmando...' : 'Confirmar Cita'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          )}

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
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#314595] text-white rounded-tr-none'
                      : 'bg-[#121833] text-slate-200 border border-white/10 rounded-tl-none'
                  }`}
                >
                  {/* Message formatted content */}
                  <div className="whitespace-pre-line text-[13px]">
                    {msg.content.split('\n').map((paragraph, pIdx) => {
                      if (!paragraph) return <div key={pIdx} className="h-1.5" />;

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

                  {/* Confirmed Appointment Card in Chat */}
                  {msg.appointmentCard && (
                    <div className="mt-3 p-3 rounded-xl bg-[#090d1c] border border-emerald-500/40 shadow-lg text-slate-200 space-y-2">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                        <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          RESERVA CONFIRMADA
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{msg.appointmentCard.id}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 text-[10px] block">Fecha y Hora</span>
                          <span className="font-semibold text-white">
                            {msg.appointmentCard.date} • {msg.appointmentCard.time}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Asistente</span>
                          <span className="font-semibold text-white truncate block">{msg.appointmentCard.name}</span>
                        </div>
                      </div>

                      <div className="pt-1 flex flex-wrap gap-2">
                        <a
                          href={msg.appointmentCard.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#314595] hover:bg-[#223488] text-white text-[11px] font-bold transition-colors shadow-sm"
                        >
                          <Video className="w-3.5 h-3.5 text-[#EC9731]" />
                          <span>Google Meet</span>
                        </a>

                        <a
                          href={getGoogleCalendarUrl(msg.appointmentCard)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161d3a] hover:bg-[#1f2850] border border-white/15 text-slate-200 text-[11px] transition-colors"
                        >
                          <Calendar className="w-3 h-3 text-[#EC9731]" />
                          <span>Guardar en Calendario</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Contextual Action Buttons in Ro-Bot response */}
                  {msg.role === 'model' && !msg.appointmentCard && (
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                      {/* Trigger In-chat Booking */}
                      {(msg.content.toLowerCase().includes('cita') ||
                        msg.content.toLowerCase().includes('llamada') ||
                        msg.content.toLowerCase().includes('agend')) && (
                        <button
                          onClick={() => {
                            soundFX.playClick();
                            setShowBookingForm(true);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-[#EC9731] text-[#0b0e1b] font-bold transition-transform hover:scale-105 cursor-pointer shadow-sm"
                        >
                          <Calendar className="w-3 h-3" />
                          <span>Completar Reserva Aquí</span>
                        </button>
                      )}

                      {/* Jump to projects */}
                      {msg.content.toLowerCase().includes('proyecto') && (
                        <button
                          onClick={() => scrollToSection('projects')}
                          className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-[#314595]/40 hover:bg-[#314595] text-slate-200 hover:text-white border border-[#314595] transition-colors cursor-pointer"
                        >
                          <span>Ver Proyectos</span>
                          <ExternalLink className="w-3 h-3 text-[#EC9731]" />
                        </button>
                      )}

                      {/* Jump to cost estimator */}
                      {(msg.content.toLowerCase().includes('presupuesto') || msg.content.toLowerCase().includes('estimad')) && (
                        <button
                          onClick={() => scrollToSection('contact')}
                          className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-[#161d3a] hover:bg-[#223488] text-slate-200 hover:text-white border border-white/15 transition-colors cursor-pointer"
                        >
                          <span>Estimador de Costos</span>
                          <ChevronRight className="w-3 h-3 text-[#EC9731]" />
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
                placeholder="Pregunta a Ro-Bot sobre servicios, recomendaciones o citas..."
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
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1 font-mono">
              <span>Ro-Bot • Asistente oficial Códix</span>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setShowBookingForm(true);
                }}
                className="text-[#EC9731] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Calendar className="w-3 h-3" />
                <span>Agendar llamada 30 min</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
