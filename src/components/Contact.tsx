import React, { useState } from 'react';
import { Send, Mail, Github, Linkedin, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { CostEstimator } from './CostEstimator';
import { soundFX } from '../utils/soundFX';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: 'Web Development',
    budget: '$3,000 - $5,000',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState<{ proposalId: string; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Por favor, completa todos los campos requeridos.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        setSuccessResponse({
          proposalId: data.proposalId,
          message: data.message
        });
        setFormData({
          name: '',
          email: '',
          company: '',
          projectType: 'Web Development',
          budget: '$3,000 - $5,000',
          message: ''
        });
      } else {
        setErrorMessage(data.error || 'Ocurrió un error al enviar el formulario.');
      }
    } catch (err) {
      setErrorMessage('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyEstimate = (projectType: string, budget: string, details: string) => {
    setFormData(prev => ({
      ...prev,
      projectType,
      budget,
      message: prev.message ? `${prev.message}\n\n[${details}]` : details
    }));
  };

  return (
    <section id="contact" className="relative py-24 bg-[#0b0e1b] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10152b] border border-white/10 text-xs font-mono text-[#EC9731] mb-3">
            <span>06. CONTACTO</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl text-balance mb-3">
            ¿Tienes una idea? Hagámosla realidad.
          </h2>
          <p className="text-sm text-slate-400 max-w-lg text-balance">
            Cuéntame qué tienes en mente. Estoy preparado para ayudarte a convertir tu próximo proyecto en una experiencia digital extraordinaria.
          </p>
        </div>

        {/* Cost Estimator */}
        <CostEstimator onApplyEstimate={handleApplyEstimate} />

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6">Formulario de Propuesta</h3>

            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">
                    NOMBRE *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Elena Rostova"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070914] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#EC9731]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="elena@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070914] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#EC9731]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">
                    EMPRESA (OPCIONAL)
                  </label>
                  <input
                    type="text"
                    placeholder="Cybertech Studio"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070914] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#EC9731]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">
                    TIPO DE PROYECTO *
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070914] border border-white/10 text-xs text-white focus:outline-none focus:border-[#EC9731]"
                  >
                    <option value="Diseño y Desarrollo Web">Diseño y Desarrollo Web</option>
                    <option value="Diseño UI/UX">Diseño UI/UX</option>
                    <option value="Aplicaciones Web">Aplicaciones Web</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Automatización e Integración">Automatización e Integración</option>
                    <option value="Mantenimiento y Optimización">Mantenimiento y Optimización</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">
                  PRESUPUESTO ESTIMADO
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['< $2,000', '$2,000 - $5,000', '$5,000 - $10,000', '> $10,000'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => {
                        soundFX.playClick();
                        setFormData({ ...formData, budget: b });
                      }}
                      className={`py-2 px-2.5 rounded-lg text-xs font-mono border transition-colors cursor-pointer ${
                        formData.budget === b
                          ? 'bg-[#314595] border-[#EC9731] text-white font-bold'
                          : 'bg-[#070914] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">
                  DESCRIPCIÓN DEL PROYECTO *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detalla los objetivos principales..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070914] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#EC9731]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#314595] hover:bg-[#223488] transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Procesando...</span>
                ) : (
                  <>
                    <span>Enviar propuesta</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Direct Channels */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
              <h3 className="text-base font-bold text-white mb-1">Canales Directos</h3>

              <a
                href="mailto:contacto@aurastudio.dev"
                onClick={() => soundFX.playClick()}
                className="p-3.5 rounded-xl bg-[#070914] border border-white/10 hover:border-[#EC9731] transition-colors flex items-center gap-3.5 group"
              >
                <div className="p-2.5 rounded-lg bg-[#314595]/30 text-[#EC9731]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">CORREO</span>
                  <span className="text-xs font-bold text-white">contacto@aurastudio.dev</span>
                </div>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFX.playClick()}
                className="p-3.5 rounded-xl bg-[#070914] border border-white/10 hover:border-[#EC9731] transition-colors flex items-center gap-3.5 group"
              >
                <div className="p-2.5 rounded-lg bg-[#314595]/30 text-[#EC9731]">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">GITHUB</span>
                  <span className="text-xs font-bold text-white">github.com/aura-dev</span>
                </div>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFX.playClick()}
                className="p-3.5 rounded-xl bg-[#070914] border border-white/10 hover:border-[#EC9731] transition-colors flex items-center gap-3.5 group"
              >
                <div className="p-2.5 rounded-lg bg-[#314595]/30 text-[#EC9731]">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">LINKEDIN</span>
                  <span className="text-xs font-bold text-white">linkedin.com/in/aura-dev</span>
                </div>
              </a>

              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFX.playClick()}
                className="p-3.5 rounded-xl bg-[#070914] border border-white/10 hover:border-[#EC9731] transition-colors flex items-center gap-3.5 group"
              >
                <div className="p-2.5 rounded-lg bg-[#314595]/30 text-[#EC9731]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">WHATSAPP</span>
                  <span className="text-xs font-bold text-white">+34 600 000 000</span>
                </div>
              </a>
            </div>

            <div className="p-5 rounded-2xl bg-[#10152b] border border-white/10 flex items-center gap-3.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
              <div>
                <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  DISPONIBILIDAD INMEDIATA
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Aceptando proyectos para desarrollo de aplicaciones y sitios web.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {successResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0e1b]/90 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white">¡Propuesta Enviada!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {successResponse.message}
            </p>

            <div className="p-2.5 rounded-lg bg-[#070914] border border-white/10 text-xs font-mono text-slate-400">
              SEGUIMIENTO: <span className="text-[#EC9731] font-bold">{successResponse.proposalId}</span>
            </div>

            <button
              onClick={() => {
                soundFX.playClick();
                setSuccessResponse(null);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#EC9731] hover:bg-[#d88220] transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
