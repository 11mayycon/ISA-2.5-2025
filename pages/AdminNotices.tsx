
import React, { useState, useEffect } from 'react';
import { Notice } from '../types';
import { 
  Plus, Bell, Info, AlertTriangle, Zap, Wrench, PartyPopper, 
  Trash2, Eye, Calendar, Users, ChevronRight, X, Send
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

const AdminNotices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    type: 'INFORMATIVO' as Notice['type'],
    audience: 'TODOS' as 'TODOS'
  });

  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem('isa_notices');
      if (stored) setNotices(JSON.parse(stored));
      setLoading(false);
    };
    load();
  }, []);

  const saveNotices = (updated: Notice[]) => {
    localStorage.setItem('isa_notices', JSON.stringify(updated));
    setNotices(updated);
  };

  const createNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const notice: Notice = {
      id: `AVS-${Date.now()}`,
      ...newNotice,
      audience: 'TODOS',
      publishDate: new Date().toISOString(),
      readBy: []
    };
    saveNotices([notice, ...notices]);
    setIsModalOpen(false);
    setNewNotice({ title: '', content: '', type: 'INFORMATIVO', audience: 'TODOS' });
  };

  const deleteNotice = (id: string) => {
    if (window.confirm('Excluir este aviso permanentemente?')) {
      saveNotices(notices.filter(n => n.id !== id));
    }
  };

  const getTypeIcon = (type: Notice['type']) => {
    switch(type) {
      case 'URGENTE': return <AlertTriangle className="text-red-500" />;
      case 'IMPORTANTE': return <Zap className="text-yellow-500" />;
      case 'MANUTENCAO': return <Wrench className="text-purple-500" />;
      case 'ATUALIZACAO': return <PartyPopper className="text-green-500" />;
      default: return <Info className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Central de Avisos</h2>
          <p className="text-gray-500 text-sm">Crie e gerencie comunicações globais para todos os clientes.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-cyan-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Novo Aviso
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#121220] border border-gray-800 p-6 rounded-2xl">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Avisos Ativos</p>
          <h3 className="text-3xl font-black">{notices.length}</h3>
        </div>
        <div className="bg-[#121220] border border-gray-800 p-6 rounded-2xl">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Taxa de Leitura</p>
          <h3 className="text-3xl font-black text-cyan-400">82%</h3>
        </div>
      </div>

      {loading ? (
        <div className="p-20 flex justify-center"><div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : notices.length === 0 ? (
        <EmptyState 
          icon={Bell} 
          title="Nenhum aviso emitido" 
          description="Você ainda não enviou nenhum comunicado global para sua base de clientes."
        />
      ) : (
        <div className="bg-[#121220] border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-900/50 text-[10px] text-gray-500 uppercase tracking-widest font-black border-b border-gray-800">
                  <th className="px-6 py-4">Status / Tipo</th>
                  <th className="px-6 py-4">Título do Aviso</th>
                  <th className="px-6 py-4">Publicado em</th>
                  <th className="px-6 py-4">Alcance</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {notices.map((n) => (
                  <tr key={n.id} className="hover:bg-white/5 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-950 flex items-center justify-center border border-white/5">
                          {getTypeIcon(n.type)}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          n.type === 'URGENTE' ? 'text-red-500' : 'text-gray-500'
                        }`}>{n.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold">{n.title}</p>
                      <p className="text-[10px] text-gray-500 truncate max-w-xs">{n.content}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(n.publishDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-cyan-500" />
                        <span className="text-xs font-bold text-gray-300">Todos</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-gray-500 hover:text-white transition-colors"><Eye size={18} /></button>
                        <button onClick={() => deleteNotice(n.id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#121220] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gray-900/50">
              <h3 className="text-xl font-bold">Lançar Novo Aviso</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={createNotice} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Tipo de Aviso</label>
                  <select 
                    value={newNotice.type}
                    onChange={(e) => setNewNotice({...newNotice, type: e.target.value as any})}
                    className="w-full bg-gray-950 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm"
                  >
                    <option value="INFORMATIVO">Informativo</option>
                    <option value="IMPORTANTE">Importante</option>
                    <option value="URGENTE">Urgente</option>
                    <option value="ATUALIZACAO">Atualização</option>
                    <option value="MANUTENCAO">Manutenção</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Público Alvo</label>
                  <select className="w-full bg-gray-950 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm">
                    <option>Todos os Clientes</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Título do Comunicado</label>
                <input 
                  type="text" 
                  required
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                  className="w-full bg-gray-950 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm"
                  placeholder="Ex: Manutenção Programada para Sábado"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Conteúdo do Aviso</label>
                <textarea 
                  required
                  rows={5}
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                  className="w-full bg-gray-950 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm resize-none"
                  placeholder="Descreva detalhadamente o aviso que os clientes receberão..."
                />
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-3"
              >
                <Send size={18} /> Publicar Aviso Agora
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotices;
