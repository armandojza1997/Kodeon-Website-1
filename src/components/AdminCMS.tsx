import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Trash2, Edit3, Settings, Database, Layout, MessageSquare, LogIn, LogOut, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { signInWithPopup, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { soundFX } from '../utils/soundFX';

interface AdminCMSProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'faq'>('projects');
  const [items, setItems] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        syncUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && isOpen) {
      fetchItems();
    }
  }, [user, isOpen, activeTab]);

  const syncUser = async (currentUser: User) => {
    try {
      const token = await currentUser.getIdToken();
      await fetch('/api/cms/sync-user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error syncing user:', error);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const endpoint = `/api/cms/${activeTab}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      soundFX.playClick();
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      soundFX.playClick();
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAddItem = () => {
    soundFX.playClick();
    const newItem = activeTab === 'projects' ? { name: 'Nuevo Proyecto', category: 'General', category_key: 'general', description: '', image: '' } : 
                    activeTab === 'services' ? { title: 'Nuevo Servicio', description: '', icon: 'Settings' } :
                    { question: 'Nueva Pregunta', answer: '', category: 'General' };
    
    setItems([newItem, ...items]);
  };

  const handleSaveItem = async (item: any) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/cms/${activeTab}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      });
      
      if (res.ok) {
        setStatus({ type: 'success', message: 'Guardado correctamente' });
        fetchItems();
        soundFX.playSuccess();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Error al guardar' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!user || !id) return;
    if (!confirm('¿Estás seguro de eliminar este elemento?')) return;
    
    try {
      const token = await user.getIdToken();
      await fetch(`/api/cms/${activeTab}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchItems();
      soundFX.playClick();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0b0e1b]/95 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-5xl h-[85vh] bg-[#10152b] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-[#161d3a]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#EC9731]/20 border border-[#EC9731]/40">
              <Settings className="w-5 h-5 text-[#EC9731]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Códix CMS <span className="text-[10px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded ml-2 text-emerald-400 uppercase">Live SQL</span></h2>
              <p className="text-xs text-slate-400 font-mono">Gestión de contenido en tiempo real</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <img src={user.photoURL || ''} alt="" className="w-6 h-6 rounded-full border border-[#EC9731]/30" />
                <span className="text-[10px] font-mono text-slate-300">{user.email}</span>
                <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {!user ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 rounded-3xl bg-[#314595]/20 border border-[#314595]/40 flex items-center justify-center mb-8">
              <LogIn className="w-10 h-10 text-[#EC9731]" />
            </div>
            <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Acceso Restringido</h3>
            <p className="text-slate-400 max-w-md mb-10 leading-relaxed">
              Inicia sesión con tu cuenta de administrador autorizada para gestionar los proyectos, servicios y contenido del sitio.
            </p>
            <button 
              onClick={handleLogin}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-[#0b0e1b] font-bold text-sm hover:bg-[#EC9731] hover:text-white transition-all shadow-xl shadow-white/5"
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
              Acceder con Google
            </button>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 border-r border-white/10 p-6 flex flex-col gap-2 bg-[#0d1124]">
              <button 
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-mono transition-all ${activeTab === 'projects' ? 'bg-[#314595] text-white shadow-lg shadow-[#314595]/20' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <Layout className="w-4 h-4" />
                Proyectos
              </button>
              <button 
                onClick={() => setActiveTab('services')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-mono transition-all ${activeTab === 'services' ? 'bg-[#314595] text-white shadow-lg shadow-[#314595]/20' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <Database className="w-4 h-4" />
                Servicios
              </button>
              <button 
                onClick={() => setActiveTab('faq')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-mono transition-all ${activeTab === 'faq' ? 'bg-[#314595] text-white shadow-lg shadow-[#314595]/20' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <MessageSquare className="w-4 h-4" />
                FAQ
              </button>
              
              <div className="mt-auto">
                <div className="p-4 rounded-2xl bg-[#EC9731]/5 border border-[#EC9731]/20 text-[9px] text-slate-400 font-mono leading-relaxed">
                  <div className="flex items-center gap-2 text-[#EC9731] mb-2">
                    <Database className="w-3 h-3" />
                    <span>PostgreSQL Active</span>
                  </div>
                  Sincronización en tiempo real habilitada. Todos los cambios se reflejan instantáneamente en el frontend.
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#0b0e1b]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white capitalize">{activeTab}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-1">Total: {items.length} elementos</p>
                </div>
                <button 
                  onClick={handleAddItem}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#314595] hover:bg-[#223488] border border-[#314595] text-xs font-bold text-white transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4 text-[#EC9731]" />
                  Nuevo {activeTab === 'projects' ? 'Proyecto' : activeTab === 'services' ? 'Servicio' : 'FAQ'}
                </button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                  <Loader2 className="w-10 h-10 text-[#EC9731] animate-spin mb-4" />
                  <p className="text-xs font-mono text-slate-400">Consultando base de datos...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence>
                    {items.map((item, idx) => (
                      <motion.div 
                        key={item.id || `new-${idx}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#EC9731]/30 transition-all group"
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-400 uppercase">#{item.id || 'NUEVO'}</span>
                              <input 
                                type="text" 
                                value={activeTab === 'projects' ? item.name : activeTab === 'services' ? item.title : item.question}
                                onChange={(e) => {
                                  const newItems = [...items];
                                  if (activeTab === 'projects') newItems[idx].name = e.target.value;
                                  else if (activeTab === 'services') newItems[idx].title = e.target.value;
                                  else newItems[idx].question = e.target.value;
                                  setItems(newItems);
                                }}
                                className="bg-transparent border-none text-white font-bold text-lg outline-none focus:text-[#EC9731] transition-colors"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleSaveItem(item)}
                                disabled={isSaving}
                                className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                              >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              </button>
                              <button 
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <textarea 
                              placeholder="Descripción o contenido..."
                              value={activeTab === 'projects' ? item.description : activeTab === 'services' ? item.description : item.answer}
                              onChange={(e) => {
                                const newItems = [...items];
                                if (activeTab === 'projects') newItems[idx].description = e.target.value;
                                else if (activeTab === 'services') newItems[idx].description = e.target.value;
                                else newItems[idx].answer = e.target.value;
                                setItems(newItems);
                              }}
                              rows={2}
                              className="w-full bg-[#161d3a] border border-white/5 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-[#EC9731]/40"
                            />
                            <div className="space-y-2">
                              <input 
                                type="text"
                                placeholder={activeTab === 'projects' ? "URL de imagen" : activeTab === 'services' ? "Icono (lucide name)" : "Categoría"}
                                value={activeTab === 'projects' ? item.image : activeTab === 'services' ? item.icon : item.category}
                                onChange={(e) => {
                                  const newItems = [...items];
                                  if (activeTab === 'projects') newItems[idx].image = e.target.value;
                                  else if (activeTab === 'services') newItems[idx].icon = e.target.value;
                                  else newItems[idx].category = e.target.value;
                                  setItems(newItems);
                                }}
                                className="w-full bg-[#161d3a] border border-white/5 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-[#EC9731]/40"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Status */}
        <AnimatePresence>
          {status && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className={`absolute bottom-24 right-8 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl z-[110] ${status.type === 'success' ? 'bg-emerald-950 border border-emerald-500 text-emerald-200' : 'bg-red-950 border border-red-500 text-red-200'}`}
            >
              {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="text-sm font-bold">{status.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-8 py-6 border-t border-white/10 bg-[#0b0e1b] flex items-center justify-between">
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Códix SQL Engine v2.0 • Data Center: {auth.app.options.projectId}</p>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-mono text-slate-600">Status: {user ? 'Authenticated' : 'Waiting'}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
