import React, { useState } from 'react';
import { Calculator, Sparkles, Check, Clock, DollarSign, Send } from 'lucide-react';
import { soundFX } from '../utils/soundFX';

interface CostEstimatorProps {
  onApplyEstimate: (projectType: string, budget: string, details: string) => void;
}

export const CostEstimator: React.FC<CostEstimatorProps> = ({ onApplyEstimate }) => {
  const [projectType, setProjectType] = useState<string>('Web Development');
  const [pages, setPages] = useState<number>(3);
  const [complexity, setComplexity] = useState<'baja' | 'media' | 'alta'>('media');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['auth', 'animations']);
  const [loading, setLoading] = useState<boolean>(false);
  const [estimateResult, setEstimateResult] = useState<{
    investment: string;
    timeline: string;
  } | null>(null);

  const featureOptions = [
    { id: 'auth', label: 'Autenticación / Roles' },
    { id: 'payment', label: 'Pasarela de Pagos Stripe' },
    { id: 'cms', label: 'Gestión de Contenidos (CMS)' },
    { id: 'multilingual', label: 'Multi-idioma (i18n)' },
    { id: 'animations', label: 'Motion Graphics / WebGL' },
    { id: 'seo_pro', label: 'SEO & Core Vitals Pro' }
  ];

  const toggleFeature = (id: string) => {
    soundFX.playClick();
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  const calculateEstimate = async () => {
    soundFX.playClick();
    setLoading(true);

    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType,
          complexity,
          pages,
          features: selectedFeatures
        })
      });

      const data = await res.json();
      if (data.success) {
        setEstimateResult({
          investment: data.estimatedInvestment,
          timeline: data.estimatedTimeline
        });
      }
    } catch (e) {
      setEstimateResult({
        investment: '$2,200 - $3,500 USD',
        timeline: '12 - 18 días hábiles'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0b0e1b] mb-12">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="p-2.5 rounded-xl bg-[#314595]/30 text-[#EC9731]">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Calculadora de Proyectos</h3>
          <p className="text-xs text-slate-400">Estimación instantánea de inversión y plazos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">TIPO DE PROYECTO</label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#070914] border border-white/10 text-xs text-white focus:outline-none focus:border-[#EC9731]"
            >
              <option value="Web Design">Diseño Web Institucional</option>
              <option value="Web Development">Desarrollo Web Full-Stack</option>
              <option value="Applications">Aplicaciones Web / Dashboards</option>
              <option value="E-commerce">Tienda Online / E-commerce</option>
              <option value="Custom Solutions">Solución a Medida / API</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono font-semibold text-slate-300">CANTIDAD DE VISTAS</label>
              <span className="text-xs font-mono text-[#EC9731] font-bold">{pages} v.</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              className="w-full accent-[#EC9731] cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">MÓDULOS</label>
            <div className="grid grid-cols-2 gap-2">
              {featureOptions.map((feat) => {
                const isSelected = selectedFeatures.includes(feat.id);
                return (
                  <button
                    key={feat.id}
                    type="button"
                    onClick={() => toggleFeature(feat.id)}
                    className={`p-2 rounded-lg text-left text-xs font-medium border transition-colors cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#314595] border-[#EC9731] text-white'
                        : 'bg-[#070914] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{feat.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#EC9731]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={calculateEstimate}
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#314595] hover:bg-[#223488] transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Calculando...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Calcular Estimación</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col justify-between p-5 rounded-xl bg-[#070914] border border-white/10">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-3">
              RESULTADO
            </span>

            {estimateResult ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-lg bg-[#314595]/20 border border-[#314595]/50">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                    <DollarSign className="w-4 h-4 text-[#EC9731]" />
                    <span>Inversión Estimada:</span>
                  </div>
                  <span className="text-xl font-extrabold text-white font-mono">
                    {estimateResult.investment}
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Tiempo de Entrega:</span>
                  </div>
                  <span className="text-base font-bold text-white font-mono">
                    {estimateResult.timeline}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                Haz clic en "Calcular Estimación" para ver el presupuesto y plazo.
              </div>
            )}
          </div>

          {estimateResult && (
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onApplyEstimate(
                  projectType,
                  estimateResult.investment,
                  `Estimación: ${projectType} (${pages} vistas, Módulos: ${selectedFeatures.join(', ')}). Inversión: ${estimateResult.investment}, Plazo: ${estimateResult.timeline}`
                );
              }}
              className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#EC9731] hover:bg-[#d88220] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Usar en el formulario</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
