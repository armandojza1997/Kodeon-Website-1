import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Trash2, Edit3, Settings, Database, Layout, MessageSquare, LogIn, LogOut, Loader2, CheckCircle2, AlertCircle, Key, User as UserIcon } from 'lucide-react';
import { soundFX } from '../utils/soundFX';

interface AdminCMSProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'faq'>('projects');
  const [items, setItems] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    // Restore session if exists
    const savedSession = sessionStorage.getItem('codix_admin_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setUser(parsed.user);
      } catch (e) {
        sessionStorage.removeItem('codix_admin_session');
      }
    }
  }, []);

  useEffect(() => {
    if (user && isOpen) {
      fetchItems();
    }
  }, [user, isOpen, activeTab]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const endpoint = `/api/cms/${activeTab}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    
    try {
      soundFX.playClick();
      const res = await fetch('/api/cms/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        sessionStorage.setItem('codix_admin_session', JSON.stringify({ token: data.token, user: data.user }));
        soundFX.playSuccess();
      } else {
        setStatus({ type: 'error', message: data.error || 'Credenciales incorrectas' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    soundFX.playClick();
    setUser(null);
    sessionStorage.removeItem('codix_admin_session');
  };

  const getToken = () => {
    const session = sessionStorage.getItem('codix_admin_session');
    if (!session) return null;
    return JSON.parse(session).token;
  };

  const handleAddItem = () => {
    soundFX.playClick();
    const newItem = activeTab === 'projects' ? { name: 'Nuevo Proyecto', category: 'General', category_key: 'general', description: '', image: '', published: true } : 
                    activeTab === 'services' ? { title: 'Nuevo Servicio', description: '', icon: 'Settings' } :
                    { question: 'Nueva Pregunta', answer: '', category: 'General' };
    
    setItems([newItem, ...items]);
  };

  const handleSaveItem = async (item: any) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const token = getToken();
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
      const token = getToken();
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
              <h2 className="text-xl font-bold text-white">Códix CMS <span className="text-[10px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded ml-2 text-emerald-400 uppercase">Secure SQL</span></h2>
              <p className="text-xs text-slate-400 font-mono">Panel de Control Maestro</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <UserIcon className="w-4 h-4 text-[#EC9731]" />
                <span className="text-[10px] font-mono text-slate-300 uppercase">{user.username}</span>
                <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors ml-2 border-l border-white/10 pl-2">
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
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[radial-gradient(circle_at_center,_#161d3a_0%,_#0b0e1b_100%)]">
            <div className="w-20 h-20 rounded-3xl bg-[#314595]/20 border border-[#314595]/40 flex items-center justify-center mb-8 shadow-2xl shadow-[#314595]/20">
              <Key className="w-10 h-10 text-[#EC9731]" />
            </div>
            <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Códix Auth Gate</h3>
            <p className="text-slate-400 max-w-md mb-10 leading-relaxed text-sm">
              Introduce tus credenciales de administrador para acceder a la gestión centralizada de contenidos.
            </p>
            
            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Nombre de usuario" 
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:border-[#EC9731] outline-none transition-all"
                  required
                />
              </div>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="password" 
                  placeholder="Contraseña" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:border-[#EC9731] outline-none transition-all"
                  required
                />
              </div>
              
              {status?.type === 'error' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  {status.message}
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-[#EC9731] text-white font-bold text-sm hover:bg-[#d88a2c] transition-all shadow-xl shadow-[#EC9731]/20 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Acceder al Sistema'}
              </button>
            </form>
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
                    <span>PostgreSQL Cluster Active</span>
                  </div>
                  Modo Maestro habilitado. Los cambios realizados afectarán directamente a la base de datos de producción.
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#0b0e1b]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white capitalize">{activeTab}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-1">Sincronización SQL habilitada</p>
                </div>
                <button 
                  onClick={handleAddItem}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#314595] hover:bg-[#223488] border border-[#314595] text-xs font-bold text-white transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4 text-[#EC9731]" />
                  Añadir {activeTab === 'projects' ? 'Proyecto' : activeTab === 'services' ? 'Servicio' : 'FAQ'}
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
                                    placeholder={activeTab === 'projects' ? "Categoría" : activeTab === 'services' ? "Rango de precio" : "Categoría"}
                                    value={activeTab === 'projects' ? item.category : activeTab === 'services' ? item.price_range : item.category}
                                    onChange={(e) => {
                                      const newItems = [...items];
                                      if (activeTab === 'projects') newItems[idx].category = e.target.value;
                                      else if (activeTab === 'services') newItems[idx].price_range = e.target.value;
                                      else newItems[idx].category = e.target.value;
                                      setItems(newItems);
                                    }}
                                    className="w-full bg-[#161d3a] border border-white/5 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-[#EC9731]/40"
                                />
                              <input 
                                type="text"
                                placeholder={activeTab === 'projects' ? "URL de imagen" : activeTab === 'services' ? "Icono (lucide name)" : ""}
                                value={activeTab === 'projects' ? item.image : activeTab === 'services' ? item.icon : ''}
                                onChange={(e) => {
                                  const newItems = [...items];
                                  if (activeTab === 'projects') newItems[idx].image = e.target.value;
                                  else if (activeTab === 'services') newItems[idx].icon = e.target.value;
                                  setItems(newItems);
                                }}
                                className={`w-full bg-[#161d3a] border border-white/5 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-[#EC9731]/40 ${activeTab === 'faq' ? 'hidden' : ''}`}
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
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Códix SQL Engine v2.5 • Auth: Database Managed</p>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-mono text-slate-600">Status: {user ? 'Master Authenticated' : 'Locked'}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
