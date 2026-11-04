import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { TechStack } from './components/TechStack';
import { Projects } from './components/Projects';
import { Process } from './components/Process';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';

export default function App() {
  const handleOpenContact = () => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e1b] text-slate-100 relative font-sans antialiased selection:bg-[#EC9731] selection:text-white">
      {/* Custom Interactive Ring Cursor */}
      <CustomCursor />

      {/* Top Bar Navigation */}
      <Navbar onOpenContact={handleOpenContact} />

      {/* Main Page Layout Sections */}
      <main>
        {/* Section 1: Hero with Motion Graphics Background */}
        <Hero onOpenContact={handleOpenContact} />

        {/* Section 2: Sobre Mí */}
        <About />

        {/* Section 3: Servicios */}
        <Services />

        {/* Section 4: Tech Stack */}
        <TechStack />

        {/* Section 5: Proyectos Seleccionados */}
        <Projects />

        {/* Section 6: Metodología */}
        <Process />

        {/* Section 7: Contacto & Calculadora */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
