import React, { useEffect, useRef, useState } from 'react';
import { soundFX } from '../utils/soundFX';

interface InteractiveRobotProps {
  className?: string;
  onOpenChat?: () => void;
}

type GestureType = 'neutral' | 'happy' | 'thinking' | 'wink' | 'curious' | 'nodding';

export const InteractiveRobot: React.FC<InteractiveRobotProps> = ({ className = '', onOpenChat }) => {
  const robotRef = useRef<HTMLDivElement | null>(null);

  // Mouse position state relative to the robot center (-1 to 1)
  const targetLook = useRef({ x: 0, y: 0 });
  const currentLook = useRef({ x: 0, y: 0 });

  // Robot expression and animation states
  const [blink, setBlink] = useState(false);
  const [gesture, setGesture] = useState<GestureType>('neutral');
  const [speechBubble, setSpeechBubble] = useState<string | null>('¡Hola! Soy Ro-Bot 🤖');
  const [isWaving, setIsWaving] = useState(false);

  // Render values for smooth transforms
  const [renderProps, setRenderProps] = useState({
    headRotate: 0,
    headTilt: 0,
    headTranslateX: 0,
    headTranslateY: 0,
    eyeX: 0,
    eyeY: 0,
  });

  // Track mouse coordinates relative to the robot
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!robotRef.current) return;
      const rect = robotRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Distance factor
      const maxDist = Math.max(window.innerWidth, window.innerHeight) * 0.6;
      const nx = Math.max(-1, Math.min(1, deltaX / Math.min(500, maxDist)));
      const ny = Math.max(-1, Math.min(1, deltaY / Math.min(500, maxDist)));

      targetLook.current = { x: nx, y: ny };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Animation frame loop for smooth dampening
    let animId: number;
    const update = () => {
      // Smooth lerp
      currentLook.current.x += (targetLook.current.x - currentLook.current.x) * 0.08;
      currentLook.current.y += (targetLook.current.y - currentLook.current.y) * 0.08;

      const lx = currentLook.current.x;
      const ly = currentLook.current.y;

      setRenderProps({
        headRotate: lx * 20, // Yaw -20deg to +20deg
        headTilt: -lx * 8,   // Roll
        headTranslateX: lx * 16,
        headTranslateY: Math.max(-6, ly * 12),
        eyeX: lx * 9,        // Pupil translation inside visor
        eyeY: ly * 7,
      });

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Natural Blinking system
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;

    const triggerBlink = () => {
      setBlink(true);
      setTimeout(() => {
        setBlink(false);

        // 30% chance of double blink
        if (Math.random() < 0.3) {
          setTimeout(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 110);
          }, 140);
        }
      }, 130);

      const nextDelay = 2600 + Math.random() * 3200;
      blinkTimeout = setTimeout(triggerBlink, nextDelay);
    };

    blinkTimeout = setTimeout(triggerBlink, 1800);
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Hide initial greeting bubble after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setSpeechBubble(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Autonomous gesture engine
  useEffect(() => {
    let gestureInterval: NodeJS.Timeout;

    const performGesture = () => {
      const gestures: GestureType[] = ['curious', 'happy', 'thinking', 'nodding', 'wink'];
      const chosen = gestures[Math.floor(Math.random() * gestures.length)];

      setGesture(chosen);

      if (chosen === 'nodding' || chosen === 'happy') {
        setIsWaving(true);
        setTimeout(() => setIsWaving(false), 2200);
      }

      setTimeout(() => {
        setGesture('neutral');
      }, 2500);
    };

    gestureInterval = setInterval(performGesture, 7000);
    return () => clearInterval(gestureInterval);
  }, []);

  // Direct Click interaction -> Opens Chatbot & waves
  const handleRobotClick = () => {
    soundFX.playClick();
    setGesture('happy');
    setIsWaving(true);
    setSpeechBubble('¡Abriendo chat con Ro-Bot!');

    if (onOpenChat) {
      onOpenChat();
    }

    setTimeout(() => {
      setGesture('neutral');
      setIsWaving(false);
    }, 2800);

    setTimeout(() => {
      setSpeechBubble(null);
    }, 3200);
  };

  const { headRotate, headTilt, headTranslateX, headTranslateY, eyeX, eyeY } = renderProps;

  return (
    <div
      ref={robotRef}
      onClick={handleRobotClick}
      title="Ro-Bot: ¡Haz clic para chatear conmigo!"
      className={`relative select-none pointer-events-auto cursor-pointer group w-[260px] sm:w-[320px] md:w-[360px] h-[225px] sm:h-[280px] md:h-[315px] ${className}`}
    >
      {/* Speech / Reaction Bubble */}
      {speechBubble ? (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-full bg-[#10152b] border border-[#EC9731] shadow-2xl text-white font-mono text-xs whitespace-nowrap animate-bounce flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#EC9731] animate-ping" />
          <span>{speechBubble}</span>
        </div>
      ) : (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10152b]/90 border border-white/15 text-slate-300 text-[11px] font-mono group-hover:border-[#EC9731] group-hover:text-white transition-colors shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EC9731] animate-pulse" />
            Ro-Bot • Clic para chatear
          </span>
        </div>
      )}

      {/* Robot SVG Illustration Peeking Over */}
      <svg
        viewBox="0 0 200 175"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="robotShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#314595" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 1. ROBOT HEAD & VISOR (Pivots and follows mouse) */}
        <g
          id="peeking-head"
          style={{
            transformOrigin: '100px 145px',
            transform: `translate3d(${headTranslateX}px, ${headTranslateY + (gesture === 'nodding' ? 6 : 0)}px, 0) rotate(${headRotate + headTilt + (gesture === 'curious' ? 12 : 0)}deg)`,
            transition: 'transform 0.08s ease-out',
          }}
        >
          {/* Antenna Pole */}
          <line x1="100" y1="46" x2="100" y2="18" stroke="#314595" strokeWidth="2.5" />
          <circle cx="100" cy="32" r="3" fill="#10152b" stroke="#314595" strokeWidth="1" />
          {/* Glowing Antenna Tip */}
          <circle cx="100" cy="14" r="5" fill="#EC9731" className="animate-pulse" />
          <circle cx="100" cy="14" r="9" stroke="#EC9731" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />

          {/* Left Ear Sensor */}
          <g transform="translate(36, 78)">
            <rect x="0" y="0" width="10" height="28" rx="4" fill="#0e132c" stroke="#223488" strokeWidth="1.5" />
            <circle cx="5" cy="14" r="3" fill="#10152b" stroke="#314595" strokeWidth="1" />
            <line x1="5" y1="5" x2="5" y2="7" stroke="#EC9731" strokeWidth="1.5" />
            <line x1="5" y1="21" x2="5" y2="23" stroke="#EC9731" strokeWidth="1.5" />
          </g>

          {/* Right Ear Sensor */}
          <g transform="translate(154, 78)">
            <rect x="0" y="0" width="10" height="28" rx="4" fill="#0e132c" stroke="#223488" strokeWidth="1.5" />
            <circle cx="5" cy="14" r="3" fill="#10152b" stroke="#314595" strokeWidth="1" />
            <line x1="5" y1="5" x2="5" y2="7" stroke="#EC9731" strokeWidth="1.5" />
            <line x1="5" y1="21" x2="5" y2="23" stroke="#EC9731" strokeWidth="1.5" />
          </g>

          {/* Main Helmet Chassis */}
          <path
            d="M 50,72 C 50,52 68,44 100,44 C 132,44 150,52 150,72 L 152,126 C 152,150 134,160 100,160 C 66,160 48,150 48,126 Z"
            fill="#10152b"
            stroke="#223488"
            strokeWidth="2.5"
            filter="url(#robotShadow)"
          />

          {/* Forehead Architecture Seam */}
          <path d="M 68,56 L 100,62 L 132,56" stroke="#314595" strokeWidth="1.5" fill="none" />

          {/* Visor Glass Screen */}
          <rect
            x="58"
            y="68"
            width="84"
            height="58"
            rx="12"
            fill="#060913"
            stroke="#314595"
            strokeWidth="2"
          />

          {/* Visor Reflection */}
          <path d="M 64,74 L 84,74 L 72,120 L 62,120 Z" fill="#ffffff" opacity="0.04" />

          {/* EYES LAYER (Tracks Cursor) */}
          <g id="visor-eyes" style={{ transform: `translate3d(${eyeX}px, ${eyeY}px, 0)` }}>
            {/* LEFT EYE */}
            {blink ? (
              <line x1="72" y1="94" x2="88" y2="94" stroke="#EC9731" strokeWidth="2.5" strokeLinecap="round" />
            ) : gesture === 'happy' ? (
              <path d="M 72,96 Q 80,86 88,96" stroke="#EC9731" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : gesture === 'thinking' ? (
              <path d="M 72,92 L 88,96" stroke="#EC9731" strokeWidth="2.5" strokeLinecap="round" />
            ) : (
              <g>
                <rect x="71" y="86" width="18" height="18" rx="5" fill="#151e42" stroke="#314595" strokeWidth="1" />
                <rect x="74" y="89" width="12" height="12" rx="3.5" fill="#EC9731" />
                <circle cx="77" cy="92" r="1.5" fill="#ffffff" />
              </g>
            )}

            {/* RIGHT EYE */}
            {blink ? (
              <line x1="112" y1="94" x2="128" y2="94" stroke="#EC9731" strokeWidth="2.5" strokeLinecap="round" />
            ) : gesture === 'wink' ? (
              <path d="M 112,95 Q 120,100 128,95" stroke="#EC9731" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            ) : gesture === 'happy' ? (
              <path d="M 112,96 Q 120,86 128,96" stroke="#EC9731" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : gesture === 'curious' ? (
              <g>
                <circle cx="120" cy="95" r="9" fill="#151e42" stroke="#314595" strokeWidth="1" />
                <circle cx="120" cy="95" r="6.5" fill="#EC9731" />
                <circle cx="118" cy="92" r="2" fill="#ffffff" />
              </g>
            ) : (
              <g>
                <rect x="111" y="86" width="18" height="18" rx="5" fill="#151e42" stroke="#314595" strokeWidth="1" />
                <rect x="114" y="89" width="12" height="12" rx="3.5" fill="#EC9731" />
                <circle cx="117" cy="92" r="1.5" fill="#ffffff" />
              </g>
            )}

            {/* DIGITAL LED MOUTH */}
            <g transform="translate(0, 10)">
              {gesture === 'happy' ? (
                <path d="M 92,106 Q 100,114 108,106" stroke="#EC9731" strokeWidth="2" fill="none" strokeLinecap="round" />
              ) : gesture === 'thinking' ? (
                <line x1="95" y1="108" x2="105" y2="108" stroke="#314595" strokeWidth="2" strokeLinecap="round" />
              ) : gesture === 'curious' ? (
                <circle cx="100" cy="108" r="3" fill="none" stroke="#EC9731" strokeWidth="1.5" />
              ) : (
                <g>
                  <line x1="94" y1="108" x2="106" y2="108" stroke="#314595" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="100" cy="108" r="1.5" fill="#EC9731" />
                </g>
              )}
            </g>
          </g>

          {/* Chin Indicator Lights */}
          <circle cx="94" cy="146" r="1.5" fill="#EC9731" />
          <circle cx="100" cy="146" r="1.5" fill="#314595" />
          <circle cx="106" cy="146" r="1.5" fill="#EC9731" />
        </g>

        {/* 2. PEEKING HANDS (Resting on the top edge of the text container) */}
        {/* Left Peeking Hand (Clamping the edge) */}
        <g id="peeking-hand-left" transform="translate(36, 142)">
          {/* Hand Palm / Knuckle Shell */}
          <path
            d="M 2,12 C 2,5 22,5 22,12 L 20,22 L 4,22 Z"
            fill="#10152b"
            stroke="#223488"
            strokeWidth="1.5"
          />
          {/* Curved Fingertips Clamping the Top Edge */}
          <rect x="3" y="16" width="4" height="12" rx="2" fill="#0e132c" stroke="#EC9731" strokeWidth="1" />
          <rect x="9" y="15" width="4" height="13" rx="2" fill="#0e132c" stroke="#EC9731" strokeWidth="1" />
          <rect x="15" y="16" width="4" height="12" rx="2" fill="#0e132c" stroke="#EC9731" strokeWidth="1" />
        </g>

        {/* Right Hand: Either Peeking / Clamping OR Waving */}
        <g
          id="peeking-hand-right"
          style={{
            transformOrigin: '150px 150px',
            transform: isWaving
              ? 'translate3d(0, -28px, 0) rotate(-24deg)'
              : 'translate3d(0, 0, 0) rotate(0deg)',
            transition: 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
        >
          <g transform="translate(142, 142)">
            {/* Hand Palm / Knuckle Shell */}
            <path
              d="M 2,12 C 2,5 22,5 22,12 L 20,22 L 4,22 Z"
              fill="#10152b"
              stroke="#223488"
              strokeWidth="1.5"
            />
            {/* Curved Fingertips */}
            <rect x="3" y="16" width="4" height="12" rx="2" fill="#0e132c" stroke="#EC9731" strokeWidth="1" />
            <rect x="9" y="15" width="4" height="13" rx="2" fill="#0e132c" stroke="#EC9731" strokeWidth="1" />
            <rect x="15" y="16" width="4" height="12" rx="2" fill="#0e132c" stroke="#EC9731" strokeWidth="1" />
          </g>
        </g>
      </svg>
    </div>
  );
};
