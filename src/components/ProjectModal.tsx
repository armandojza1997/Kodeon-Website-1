import React, { useState } from 'react';
import { X, ExternalLink, Code2, Layers, Cpu, CheckCircle } from 'lucide-react';
import { soundFX } from '../utils/soundFX';

export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  categoryKey: 'web-design' | 'web-dev' | 'applications' | 'ecommerce' | 'custom';
  description: string;
  fullCaseStudy: string;
  image: string;
  techStack: string[];
  demoUrl?: string;
  metrics: string[];
  architectureNotes: string;
}

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'case-study' | 'architecture'>('preview');

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0b0e1b]/90 backdrop-blur-xl animate-fadeIn">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 max-w-4xl w-full max-h-[92vh] overflow-y-auto relative shadow-2xl flex flex-col gap-6">
        {/* Header & Close */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#EC9731]/20 border border-[#EC9731]/40 text-[#EC9731] font-bold">
                {project.category}
              </span>
              <span className="text-xs font-mono text-slate-400">DEMOSTRACIÓN INTERACTIVA</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {project.name}
            </h3>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            aria-label="Cerrar modal de proyecto"
            className="p-2.5 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex p-1 bg-[#070914] rounded-xl border border-white/10 max-w-md">
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('preview');
            }}
            className={`flex-1 py-2 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'preview' ? 'bg-[#314595] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vista Previa
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('case-study');
            }}
            className={`flex-1 py-2 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'case-study' ? 'bg-[#314595] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Estudio de Caso
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('architecture');
            }}
            className={`flex-1 py-2 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'architecture' ? 'bg-[#314595] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Arquitectura
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'preview' && (
          <div className="flex flex-col gap-6">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#070914] aspect-video group">
              <img
                src={project.image}
                alt={project.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <p className="text-sm text-slate-200 font-medium">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.isArray(project.metrics) && project.metrics.map((metric, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#EC9731] shrink-0" />
                  <span className="text-xs font-bold text-white">{metric}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'case-study' && (
          <div className="space-y-4 text-slate-300 text-sm leading-relaxed p-4 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="text-base font-bold text-white">Desafío & Solución Técnica</h4>
            <p className="whitespace-pre-line">{project.fullCaseStudy}</p>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-4 p-4 rounded-2xl bg-[#070914] border border-white/10 font-mono text-xs text-slate-200">
            <h4 className="text-sm font-bold text-[#EC9731] flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Blueprints de Arquitectura
            </h4>
            <p className="text-slate-300 leading-relaxed">{project.architectureNotes}</p>
            <div className="pt-3 border-t border-white/10">
              <span className="text-slate-400">Tech Stack Empleado:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {Array.isArray(project.techStack) && project.techStack.map((tech, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-[#314595]/40 border border-[#314595]/60 text-white">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Cpu className="w-4 h-4 text-[#EC9731]" />
            <span>Código optimizado y listo para producción</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFX.playClick()}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#EC9731] hover:bg-[#d88220] transition-colors shadow-lg"
              >
                <span>Visitar Proyecto</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
