import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { soundFX } from '../utils/soundFX';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0b0e1b]/90 backdrop-blur-xl animate-fadeIn">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative shadow-2xl space-y-4">
        <button
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#314595]/30 text-[#EC9731]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Política de Privacidad y Protección de Datos</h3>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans border-t border-white/10 pt-4">
          <p>
            <strong>1. Responsable del Tratamiento:</strong> Los datos personales compartidos a través de los formularios de contacto y calculadora de proyectos serán tratados confidencialmente con el único fin de evaluar solicitudes de presupuestos y propuestas de desarrollo.
          </p>
          <p>
            <strong>2. Finalidad del Tratamiento:</strong> Responder a solicitudes de contacto, realizar estimaciones de desarrollo de software y coordinar la ejecución de servicios profesionales acordados.
          </p>
          <p>
            <strong>3. Conservación de Datos:</strong> Los datos proporcionados se conservarán durante el tiempo necesario para atender la propuesta comercial y cumplir con las obligaciones legales aplicables.
          </p>
          <p>
            <strong>4. Derechos del Usuario:</strong> Puedes solicitar el acceso, rectificación, cancelación o supresión de tus datos enviando un correo a <span className="text-[#EC9731]">contacto@aurastudio.dev</span>.
          </p>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#314595] hover:bg-[#3a52b3] transition-colors cursor-pointer"
          >
            Aceptar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
