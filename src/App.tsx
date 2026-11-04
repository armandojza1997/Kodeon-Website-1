import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { TechStack } from './components/TechStack';
import { Projects } from './components/Projects';
import { Process } from './components/Process';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Insights } from './components/Insights';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { RoBotChat } from './components/RoBotChat';
import { AdminCMS } from './components/AdminCMS';

const sectionVariants: any = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut" } }
};

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleOpenContact = () => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  // Simple routing for /admin/login
  const isLoginPage = window.location.pathname === '/admin/login';

  return (
    <div className="min-h-screen bg-[#0b0e1b] text-slate-100 relative font-sans antialiased selection:bg-[#EC9731] selection:text-white">
      {/* Custom Interactive Ring Cursor */}
      <CustomCursor />

      {/* Top Bar Navigation */}
      <Navbar 
        onOpenContact={handleOpenContact} 
        onOpenChat={handleOpenChat} 
      />

      {/* Main Page Layout Sections */}
      <main>
        {/* Section 1: Hero with Motion Graphics Background & Ro-Bot Companion */}
        <Hero onOpenContact={handleOpenContact} onOpenChat={handleOpenChat} />

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <About />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <Services />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <TechStack />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <Projects />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <Process />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <Testimonials />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <FAQ />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <Insights />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <Contact />
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />

      {/* 🤖 Ro-Bot Floating AI Chatbot */}
      <RoBotChat
        isOpen={isChatOpen}
        onOpen={() => setIsChatOpen(true)}
        onClose={() => setIsChatOpen(false)}
      />

      {/* 🔐 Admin CMS Panel - Accessed via /admin/login */}
      <AdminCMS 
        isOpen={isAdminOpen || isLoginPage} 
        onClose={() => {
          setIsAdminOpen(false);
          if (isLoginPage) window.history.pushState({}, '', '/');
        }} 
      />
    </div>
  );
}

