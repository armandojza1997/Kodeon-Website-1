import React, { useEffect, useRef, useState } from 'react';

export const HeroCodeDesignBg: React.FC = () => {
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const designLayerRef = useRef<HTMLDivElement | null>(null);
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
      currentX.current += (targetX.current - currentX.current) * 0.05;
      currentY.current += (targetY.current - currentY.current) * 0.05;

      const cx = currentX.current;
      const cy = currentY.current;

      if (designLayerRef.current) {
        designLayerRef.current.style.transform = `translate3d(${cx * 22}px, ${cy * 22}px, 0)`;
      }
      if (codeLeftRef.current) {
        codeLeftRef.current.style.transform = `translate3d(${cx * -15}px, ${cy * -12}px, 0)`;
      }
      if (codeRightRef.current) {
        codeRightRef.current.style.transform = `translate3d(${cx * 18}px, ${cy * 14}px, 0)`;
      }

      if (time - lastTime > 100) {
        setMousePos({
          x: Math.round(cx * 120),
          y: Math.round(cy * 120),
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

  // Realistic code lines snippets for web development
  const codeSnippetLeft = [
    { num: '01', code: <><span className="text-[#EC9731]">interface</span> <span className="text-white">WebArchitecture</span> {'{'}</> },
    { num: '02', code: <>&nbsp;&nbsp;engine: <span className="text-[#768ef0]">'React 19 + TypeScript'</span>;</> },
    { num: '03', code: <>&nbsp;&nbsp;performance: <span className="text-[#EC9731]">99.8</span>;</> },
    { num: '04', code: <>&nbsp;&nbsp;interactive: <span className="text-[#EC9731]">true</span>;</> },
    { num: '05', code: <>{'}'}</> },
    { num: '06', code: <><span className="text-[#223488]">// Compile modern UI layout</span></> },
    { num: '07', code: <><span className="text-[#EC9731]">export async function</span> <span className="text-[#768ef0]">renderExperience</span>() {'{'}</> },
    { num: '08', code: <>&nbsp;&nbsp;<span className="text-[#EC9731]">const</span> spec = <span className="text-[#EC9731]">await</span> studio.<span className="text-[#768ef0]">init</span>();</> },
    { num: '09', code: <>&nbsp;&nbsp;<span className="text-[#EC9731]">return</span> spec.<span className="text-[#768ef0]">mount</span>({'{'} fps: <span className="text-[#EC9731]">60</span> {'}'});</> },
    { num: '10', code: <>{'}'}</> },
    { num: '11', code: <><span className="text-[#EC9731]">const</span> designSystem = {'{'}</> },
    { num: '12', code: <>&nbsp;&nbsp;tokens: [<span className="text-[#768ef0]">'#314595'</span>, <span className="text-[#EC9731]">'#EC9731'</span>],</> },
    { num: '13', code: <>&nbsp;&nbsp;scale: <span className="text-[#768ef0]">'fluid-modular'</span>,</> },
    { num: '14', code: <>&nbsp;&nbsp;latency: <span className="text-[#768ef0]">'zero-lag'</span></> },
    { num: '15', code: <>{'};'}</> },
  ];

  const codeSnippetRight = [
    { num: '16', code: <><span className="text-[#223488]">// CSS Layout & Vector Rules</span></> },
    { num: '17', code: <><span className="text-[#EC9731]">.artboard-container</span> {'{'}</> },
    { num: '18', code: <>&nbsp;&nbsp;display: <span className="text-white">flex</span>;</> },
    { num: '19', code: <>&nbsp;&nbsp;align-items: <span className="text-white">center</span>;</> },
    { num: '20', code: <>&nbsp;&nbsp;justify-content: <span className="text-white">space-between</span>;</> },
    { num: '21', code: <>&nbsp;&nbsp;gap: <span className="text-[#EC9731]">24px</span>;</> },
    { num: '22', code: <>&nbsp;&nbsp;box-sizing: <span className="text-white">border-box</span>;</> },
    { num: '23', code: <>{'}'}</> },
    { num: '24', code: <><span className="text-[#EC9731]">@keyframes</span> <span className="text-[#768ef0]">vectorDraw</span> {'{'}</> },
    { num: '25', code: <>&nbsp;&nbsp;0% {'{'} stroke-dashoffset: <span className="text-[#EC9731]">100%</span>; {'}'}</> },
    { num: '26', code: <>&nbsp;&nbsp;100% {'{'} stroke-dashoffset: <span className="text-white">0%</span>; {'}'}</> },
    { num: '27', code: <>{'}'}</> },
    { num: '28', code: <><span className="text-[#223488]">// Core State Engine Hook</span></> },
    { num: '29', code: <><span className="text-[#EC9731]">const</span> [state, setState] = <span className="text-[#768ef0]">useDigitalState</span>();</> },
    { num: '30', code: <><span className="text-[#EC9731]">export default</span> StudioView;</> },
  ];

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-[#0b0e1b]"
    >
      {/* 1. Underlying Architectural Grid (Solid hairline, NO gradients) */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(49, 69, 149, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(49, 69, 149, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* 2. Web Design Editing Frame & Vector Canvas (Center Layer) */}
      <div
        ref={designLayerRef}
        className="absolute inset-0 flex items-center justify-center will-change-transform transition-transform duration-75 ease-out"
      >
        {/* Main Artboard Canvas Frame (Figma / Web Design Layout) */}
        <div className="relative w-[920px] h-[540px] max-w-[95vw] border border-[#223488]/70 rounded-lg">
          {/* Artboard Header Tag */}
          <div className="absolute -top-7 left-0 flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span className="px-2 py-0.5 rounded bg-[#10152b] border border-white/10 text-white font-medium">
              Frame: Viewport_Desktop
            </span>
            <span className="text-slate-500">1440 × 900</span>
          </div>

          {/* Artboard Alignment Ruler Guides */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] border-l border-dashed border-[#EC9731]/30" />
          <div className="absolute left-0 right-0 top-1/2 h-[1px] border-t border-dashed border-[#314595]/50" />

          {/* Corner Bounding Crop Ticks */}
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#EC9731]" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#EC9731]" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#EC9731]" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#EC9731]" />

          {/* UI Selection Box with 8 Transform Handles */}
          <div className="absolute top-16 left-16 right-16 bottom-16 border border-[#314595] opacity-60">
            {/* 8 Handles */}
            <div className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-white border border-[#314595]" />
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border border-[#314595]" />
            <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-white border border-[#314595]" />
            <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-2.5 bg-white border border-[#314595]" />
            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 bg-white border border-[#314595]" />
            <div className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 bg-white border border-[#314595]" />
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border border-[#314595]" />
            <div className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 bg-white border border-[#314595]" />

            {/* Selection Dimension Pill */}
            <div className="absolute -bottom-7 right-0 px-2 py-0.5 rounded bg-[#10152b] border border-white/10 font-mono text-[10px] text-slate-300">
              W: 780px · H: 380px
            </div>
          </div>

          {/* Bézier Vector Curve with Tangent Handles (Pen Tool Vector Editing) */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 920 540" fill="none">
            {/* Tangent control arm 1 */}
            <line x1="200" y1="360" x2="260" y2="220" stroke="#EC9731" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="260" cy="220" r="3" fill="#EC9731" />

            {/* Tangent control arm 2 */}
            <line x1="720" y1="180" x2="640" y2="320" stroke="#314595" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="640" cy="320" r="3" fill="#314595" />

            {/* Animated Smooth Bézier Vector Curve */}
            <path
              d="M 200,360 C 260,220 640,320 720,180"
              stroke="#EC9731"
              strokeWidth="2"
              className="animate-draw-bezier"
            />

            {/* Vector Anchor Nodes */}
            <rect x="195" y="355" width="10" height="10" fill="#10152b" stroke="#EC9731" strokeWidth="2" />
            <rect x="715" y="175" width="10" height="10" fill="#10152b" stroke="#314595" strokeWidth="2" />
          </svg>

          {/* Design Token Floating Inspection Chips */}
          <div className="absolute -left-12 bottom-12 hidden lg:flex flex-col gap-1.5 p-3 rounded-xl bg-[#10152b] border border-white/10 font-mono text-[11px] text-slate-300 shadow-xl">
            <span className="text-[10px] text-[#EC9731] font-semibold uppercase tracking-wider">PROPERTIES</span>
            <span>display: flex;</span>
            <span>gap: 24px;</span>
            <span>radius: 12px;</span>
            <div className="flex items-center gap-1.5 pt-1 border-t border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-[#314595]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#EC9731]" />
              <span className="text-[10px] text-slate-400">Tokens</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Lines of Code: Left Column (TypeScript & React Architecture) */}
      <div
        ref={codeLeftRef}
        className="absolute top-20 left-4 sm:left-8 w-72 lg:w-80 h-[520px] overflow-hidden opacity-50 hidden md:block will-change-transform"
      >
        <div className="p-3 mb-2 flex items-center justify-between border-b border-white/10 text-[10px] font-mono text-slate-400">
          <span className="text-white font-medium">Architecture.tsx</span>
          <span className="text-[#EC9731]">TSX · 60fps</span>
        </div>

        {/* Streaming Code Lines */}
        <div className="flex flex-col gap-1.5 animate-code-scroll font-mono text-[11px] leading-relaxed">
          {[...codeSnippetLeft, ...codeSnippetLeft].map((item, idx) => (
            <div key={idx} className="flex items-baseline gap-3 whitespace-nowrap">
              <span className="text-slate-600 select-none text-[10px] w-5 text-right shrink-0">{item.num}</span>
              <span className="text-slate-300">{item.code}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Lines of Code: Right Column (CSS & Design Tokens Engine) */}
      <div
        ref={codeRightRef}
        className="absolute top-28 right-4 sm:right-8 w-72 lg:w-80 h-[480px] overflow-hidden opacity-50 hidden md:block will-change-transform"
      >
        <div className="p-3 mb-2 flex items-center justify-between border-b border-white/10 text-[10px] font-mono text-slate-400">
          <span className="text-white font-medium">LayoutEngine.css</span>
          <span className="text-[#314595]">VITE · HMR</span>
        </div>

        {/* Streaming Code Lines */}
        <div className="flex flex-col gap-1.5 animate-code-scroll-slow font-mono text-[11px] leading-relaxed">
          {[...codeSnippetRight, ...codeSnippetRight].map((item, idx) => (
            <div key={idx} className="flex items-baseline gap-3 whitespace-nowrap">
              <span className="text-slate-600 select-none text-[10px] w-5 text-right shrink-0">{item.num}</span>
              <span className="text-slate-300">{item.code}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Minimalist Technical Status Bar (Cursor Coordinates & Tools) */}
      <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between font-mono text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#EC9731]" />
          <span>TOOL: VECTOR_PEN · CODE_STREAM</span>
        </div>

        <div className="flex items-center gap-3">
          <span>CURSOR: [{mousePos.x}, {mousePos.y}]</span>
          <span className="text-slate-600">|</span>
          <span>SYSTEM: AURA_DEV_STUDIO</span>
        </div>
      </div>
    </div>
  );
};
