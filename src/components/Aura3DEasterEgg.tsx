import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { X, Sparkles, RefreshCw, Zap, ShieldCheck, Trophy } from 'lucide-react';
import { soundFX } from '../utils/soundFX';

interface Aura3DEasterEggProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Aura3DEasterEgg: React.FC<Aura3DEasterEggProps> = ({ isOpen, onClose }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [exploded, setExploded] = useState(false);
  const [coreColor, setCoreColor] = useState<'orange' | 'blue' | 'white' | 'gold'>('orange');

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const coreMeshRef = useRef<THREE.Mesh | null>(null);
  const wireframeMeshRef = useRef<THREE.Mesh | null>(null);
  const ring1Ref = useRef<THREE.Mesh | null>(null);
  const ring2Ref = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Mouse drag control variables
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    // Detect software WebGL safely
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = mountRef.current.clientWidth || 600;
    const height = mountRef.current.clientHeight || 500;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    mountRef.current.appendChild(renderer.domElement);

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xEC9731, 2.5);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x314595, 2.0);
    fillLight.position.set(-5, -3, -2);
    scene.add(fillLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 10);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // 5. 3D Objects: Faceted Icosahedron Core
    const coreGeo = new THREE.IcosahedronGeometry(1.4, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x314595,
      roughness: 0.2,
      metalness: 0.85,
      flatShading: true
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMeshRef.current = coreMesh;
    scene.add(coreMesh);

    // Outer Wireframe Lattice
    const wireGeo = new THREE.IcosahedronGeometry(1.85, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xEC9731,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    wireframeMeshRef.current = wireMesh;
    scene.add(wireMesh);

    // Orbital Ring 1
    const ring1Geo = new THREE.TorusGeometry(2.7, 0.03, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x314595,
      roughness: 0.1,
      metalness: 0.9
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    ring1Ref.current = ring1;
    scene.add(ring1);

    // Orbital Ring 2
    const ring2Geo = new THREE.TorusGeometry(3.2, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xEC9731,
      roughness: 0.1,
      metalness: 0.9
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = -Math.PI / 3;
    ring2Ref.current = ring2;
    scene.add(ring2);

    // Floating Particles Field
    const particleCount = 600;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0x314595);
    const c2 = new THREE.Color(0xEC9731);
    const c3 = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.5 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const mixedColor = Math.random() > 0.6 ? c2 : Math.random() > 0.3 ? c1 : c3;
      particleColors[i * 3] = mixedColor.r;
      particleColors[i * 3 + 1] = mixedColor.g;
      particleColors[i * 3 + 2] = mixedColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    particlesRef.current = particles;
    scene.add(particles);

    // Mouse Controls Event Handlers
    const domElement = mountRef.current;

    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.008;
      targetRotationRef.current.x += deltaY * 0.008;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth damping interpolation for rotation
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

      scene.rotation.x = currentRotationRef.current.x;
      scene.rotation.y = currentRotationRef.current.y;

      // Auto rotators
      if (coreMeshRef.current) {
        coreMeshRef.current.rotation.y += 0.4 * delta;
        coreMeshRef.current.rotation.x += 0.2 * delta;
      }
      if (wireframeMeshRef.current) {
        wireframeMeshRef.current.rotation.y -= 0.3 * delta;
        wireframeMeshRef.current.rotation.z += 0.1 * delta;
      }
      if (ring1Ref.current) ring1Ref.current.rotation.z += 0.5 * delta;
      if (ring2Ref.current) ring2Ref.current.rotation.z -= 0.7 * delta;
      if (particlesRef.current) particlesRef.current.rotation.y += 0.05 * delta;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      // Clean up Three.js resources
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (domElement && domElement.contains(renderer.domElement)) {
        domElement.removeChild(renderer.domElement);
      }
    };
  }, [isOpen]);

  // Handle Explosion effect toggle
  useEffect(() => {
    if (!wireframeMeshRef.current || !ring1Ref.current || !ring2Ref.current) return;

    if (exploded) {
      wireframeMeshRef.current.scale.set(1.4, 1.4, 1.4);
      ring1Ref.current.scale.set(1.3, 1.3, 1.3);
      ring2Ref.current.scale.set(1.4, 1.4, 1.4);
    } else {
      wireframeMeshRef.current.scale.set(1, 1, 1);
      ring1Ref.current.scale.set(1, 1, 1);
      ring2Ref.current.scale.set(1, 1, 1);
    }
  }, [exploded]);

  // Handle Core Color change
  useEffect(() => {
    if (!coreMeshRef.current) return;
    const mat = coreMeshRef.current.material as THREE.MeshStandardMaterial;

    switch (coreColor) {
      case 'orange':
        mat.color.setHex(0xEC9731);
        break;
      case 'blue':
        mat.color.setHex(0x314595);
        break;
      case 'white':
        mat.color.setHex(0xffffff);
        break;
      case 'gold':
        mat.color.setHex(0xd88220);
        break;
    }
  }, [coreColor]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0e1b]/90 backdrop-blur-2xl animate-fadeIn">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#EC9731]/50 max-w-2xl w-full relative shadow-[0_0_50px_rgba(236,151,49,0.25)] flex flex-col items-center">
        {/* Close button */}
        <button
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          aria-label="Cerrar Huevo de Pascua 3D"
          className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Easter Egg Badge Header */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EC9731]/20 border border-[#EC9731]/50 text-xs font-mono text-[#EC9731] font-bold mb-3">
          <Trophy className="w-4 h-4 text-[#EC9731] animate-bounce" />
          <span>¡HUEVO DE PASCUA DESBLOQUEADO!</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-white text-center mb-1">
          TECNOVA 3D Quantum Core
        </h3>
        <p className="text-xs font-mono text-slate-400 text-center mb-4">
          Arrastra con el ratón para rotar el núcleo 3D en tiempo real
        </p>

        {/* 3D Viewport Render Container */}
        <div
          ref={mountRef}
          className="w-full h-72 sm:h-80 rounded-2xl bg-[#070914] border border-white/10 relative cursor-grab active:cursor-grabbing overflow-hidden mb-6"
        />

        {/* Interactive Controls Bar */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Color Selector Swatches */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Color Núcleo:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { soundFX.playClick(); setCoreColor('orange'); }}
                className={`w-6 h-6 rounded-full bg-[#EC9731] border-2 cursor-pointer transition-transform ${coreColor === 'orange' ? 'scale-125 border-white' : 'border-transparent'}`}
                title="Acento Naranja"
              />
              <button
                onClick={() => { soundFX.playClick(); setCoreColor('blue'); }}
                className={`w-6 h-6 rounded-full bg-[#314595] border-2 cursor-pointer transition-transform ${coreColor === 'blue' ? 'scale-125 border-white' : 'border-transparent'}`}
                title="Azul AURA"
              />
              <button
                onClick={() => { soundFX.playClick(); setCoreColor('gold'); }}
                className={`w-6 h-6 rounded-full bg-[#d88220] border-2 cursor-pointer transition-transform ${coreColor === 'gold' ? 'scale-125 border-white' : 'border-transparent'}`}
                title="Oro Solar"
              />
              <button
                onClick={() => { soundFX.playClick(); setCoreColor('white'); }}
                className={`w-6 h-6 rounded-full bg-white border-2 cursor-pointer transition-transform ${coreColor === 'white' ? 'scale-125 border-[#EC9731]' : 'border-transparent'}`}
                title="Platino Puro"
              />
            </div>
          </div>

          {/* Explode / Pulse Button */}
          <button
            onClick={() => {
              soundFX.playClick();
              setExploded(!exploded);
            }}
            className={`p-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center justify-center gap-2 ${
              exploded
                ? 'bg-[#EC9731] border-[#EC9731] text-white shadow-lg'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{exploded ? 'Contraer Matriz' : 'Expandir Nodos 3D'}</span>
          </button>
        </div>

        <p className="mt-4 text-[11px] font-mono text-slate-500 text-center">
          Demostración de Three.js / WebGL para AURA Web Studio © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};
