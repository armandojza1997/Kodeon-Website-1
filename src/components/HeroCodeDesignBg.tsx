import React, { useEffect, useRef, useState } from 'react';

export const HeroCodeDesignBg: React.FC = () => {
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const codeLeftRef = useRef<HTMLDivElement | null>(null);
  const codeRightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth) * 2 - 1;
      const ny = (e.clientY / innerHeight) * 2 - 1;
      targetX.current = nx;
      targetY.current = ny;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let lastTime = 0;
    const animate = (time: number) => {
      currentX.current += (targetX.current - currentX.current) * 0.04;
      currentY.current += (targetY.current - currentY.current) * 0.04;

      const cx = currentX.current;
      const cy = currentY.current;

      if (codeLeftRef.current) {
        codeLeftRef.current.style.transform = `translate3d(${cx * -12}px, ${cy * -10}px, 0)`;
      }
      if (codeRightRef.current) {
        codeRightRef.current.style.transform = `translate3d(${cx * 14}px, ${cy * 10}px, 0)`;
      }

      if (time - lastTime > 120) {
        setMousePos({
          x: Math.round(cx * 100),
          y: Math.round(cy * 100),
        });
        lastTime = time;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  const codeSnippetLeft = [
    { num: '01', code: <><span className="text-[#EC9731]">interface</span> <span className="text-white">Architecture</span> {'{'}</> },
    { num: '02', code: <>&nbsp;&nbsp;framework: <span className="text-[#768ef0]">'React 19'</span>;</> },
    { num: '03', code: <>&nbsp;&nbsp;types: <span className="text-[#768ef0]">'TypeScript'</span>;</> },
    { num: '04', code: <>&nbsp;&nbsp;vitals: <span className="text-[#EC9731]">99.8</span>;</> },
    { num: '05', code: <>{'}'}</> },
    { num: '06', code: <><span className="text-[#EC9731]">export function</span> <span className="text-[#768ef0]">buildApp</span>() {'{'}</> },
    { num: '07', code: <>&nbsp;&nbsp;<span className="text-[#EC9731]">return</span> {'<'}<span className="text-[#768ef0]">Experience</span> /{'>'};</> },
    { num: '08', code: <>{'}'}</> },
  ];

  const codeSnippetRight = [
    { num: '09', code: <><span className="text-[#EC9731]">.studio-viewport</span> {'{'}</> },
    { num: '10', code: <>&nbsp;&nbsp;display: <span className="text-white">flex</span>;</> },
    { num: '11', code: <>&nbsp;&nbsp;align-items: <span className="text-white">center</span>;</> },
    { num: '12', code: <>&nbsp;&nbsp;gap: <span className="text-[#EC9731]">24px</span>;</> },
    { num: '13', code: <>{'}'}</> },
    { num: '14', code: <><span className="text-[#EC9731]">const</span> engine = <span className="text-[#768ef0]">useEngine</span>();</> },
  ];

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-[#0b0e1b]"
    >
      {/* 1. Subtle, Clean Minimalist Grid (Faint hairline, no clutter) */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(49, 69, 149, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(49, 69, 149, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '90px 90px',
        }}
      />

      {/* 2. Quiet, Ambient Code Stream: Left Flank */}
      <div
        ref={codeLeftRef}
        className="absolute top-32 left-6 lg:left-12 w-64 h-[380px] overflow-hidden opacity-20 hidden lg:block will-change-transform"
      >
        <div className="flex flex-col gap-2 animate-code-scroll font-mono text-[11px] leading-relaxed">
          {[...codeSnippetLeft, ...codeSnippetLeft].map((item, idx) => (
            <div key={idx} className="flex items-baseline gap-3 whitespace-nowrap">
              <span className="text-slate-600 select-none text-[10px] w-4 text-right shrink-0">{item.num}</span>
              <span className="text-slate-400">{item.code}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Quiet, Ambient Code Stream: Right Flank */}
      <div
        ref={codeRightRef}
        className="absolute top-40 right-6 lg:right-12 w-64 h-[360px] overflow-hidden opacity-20 hidden lg:block will-change-transform"
      >
        <div className="flex flex-col gap-2 animate-code-scroll-slow font-mono text-[11px] leading-relaxed">
          {[...codeSnippetRight, ...codeSnippetRight].map((item, idx) => (
            <div key={idx} className="flex items-baseline gap-3 whitespace-nowrap">
              <span className="text-slate-600 select-none text-[10px] w-4 text-right shrink-0">{item.num}</span>
              <span className="text-slate-400">{item.code}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Minimalist Corner Telemetry */}
      <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between font-mono text-[10px] text-slate-500 opacity-40">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#EC9731]" />
          <span>AURA_STUDIO // DIGITAL ARCHITECTURE</span>
        </div>
        <div>
          <span>CURSOR: [{mousePos.x}, {mousePos.y}]</span>
        </div>
      </div>
    </div>
  );
};
