
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_REQUESTS } from '../constants';
import { 
  Check, X, Filter, Search, UserPlus, MoreVertical, 
  Calendar, Ban, Trash2, Clock, ShieldCheck, Mail, 
  CreditCard, Phone, History, Zap, TrendingUp, DollarSign
} from 'lucide-react';
import { TableSkeleton } from '../components/Skeletons';
import EmptyState from '../components/EmptyState';

const Requests: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [filter, setFilter] = useState('TODOS');
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [detailModalId, setDetailModalId] = useState<string | null>(null);
  const [approvalModalId, setApprovalModalId] = useState<string | null>(null);
  
  // States for Approval form
  const [accessDays, setAccessDays] = useState('30');
  const [sendInvoice, setSendInvoice] = useState(true);
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = localStorage.getItem('isa_requests');
      if (stored) {
        setRequests(JSON.parse(stored));
      } else {
        const augmented = MOCK_REQUESTS.map(req => ({
          ...req,
          isBlocked: false,
          expiresAt: req.expiresAt || null,
          subscriptionStatus: req.subscriptionStatus || null,
          monthlyValue: 79.90
        }));
        setRequests(augmented);
        localStorage.setItem('isa_requests', JSON.stringify(augmented));
      }
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateRequest = (id: string, updates: any) => {
    const newRequests = requests.map(r => r.id === id ? { ...r, ...updates } : r);
    setRequests(newRequests);
    localStorage.setItem('isa_requests', JSON.stringify(newRequests));
  };

  const handleApprove = (id: string) => {
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + parseInt(accessDays));
    
    updateRequest(id, { 
      status: 'APROVADO', 
      expiresAt: expireDate.toISOString().split('T')[0],
      isBlocked: false,
      subscriptionStatus: parseInt(accessDays) > 0 ? 'ATIVO' : 'TESTE',
      monthlyValue: 79.90,
      totalRevenueGenerated: 0
    });
    
    setApprovalModalId(null);
    setDetailModalId(null);
    
    // Feedback with visual impact (simulated toast)
    console.log("MRR Impact: + R$ 79,90");
  };

  const handleReject = (id: string) => {
    updateRequest(id, { status: 'REPROVADO' });
    setDetailModalId(null);
  };

  const filteredData = filter === 'TODOS' ? requests : requests.filter(r => r.status === filter);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Solicitações de Acesso</h2>
          <p className="text-gray-500 text-sm">Controle de novos registros e gerenciamento de faturamento.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou matrícula..."
              className="w-full bg-[#121220] border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-800">
        {['TODOS', 'PENDENTE', 'APROVADO', 'REPROVADO', 'EXPIRADO'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all relative ${filter === tab ? 'text-cyan-400' : 'text-gray-500 hover:text-white'}`}
          >
            {tab}
            {filter === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 shadow-[0_0_10px_rgba(0,212,255,0.5)]"></div>}
          </button>
        ))}
      </div>

      {loading ? (
        <TableSkeleton />
      ) : filteredData.length === 0 ? (
        <div className="bg-[#121220] border border-gray-800 rounded-3xl p-12">
          <EmptyState 
            icon={UserPlus} 
            title="Nada por aqui" 
            description="Nenhuma solicitação encontrada para o filtro selecionado."
          />
        </div>
      ) : (
        <div className="bg-[#121220] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-900/50 text-[10px] text-gray-500 uppercase tracking-widest font-black border-b border-gray-800">
                  <th className="px-6 py-4">Matrícula / Usuário</th>
                  <th className="px-6 py-4">Impacto MRR</th>
                  <th className="px-6 py-4">Expiração</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredData.map((req) => (
                  <tr key={req.id} className={`hover:bg-white/5 transition-all group ${req.isBlocked ? 'bg-red-500/5 opacity-80' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="px-3 py-1.5 bg-gray-900 border border-white/5 rounded-lg text-xs font-mono font-black text-cyan-400 tracking-wider">
                          {req.matricula || 'PEND'}
                        </div>
                        <div>
                          <p className="text-sm font-bold flex items-center gap-2">
                            {req.name}
                            {req.isBlocked && <span className="text-[8px] bg-red-500 text-white px-1 rounded">BLOQUEADO</span>}
                          </p>
                          <p className="text-[10px] text-gray-500">{req.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-xs font-black text-green-500">
                         + R$ 79,90
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1.5">
                         <Clock size={12} className={req.expiresAt ? 'text-cyan-500' : 'text-gray-700'} />
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                           {req.expiresAt ? req.expiresAt : 'N/A'}
                         </span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest ${
                        req.status === 'APROVADO' ? 'bg-green-500/10 text-green-500' : 
                        req.status === 'PENDENTE' ? 'bg-cyan-500/10 text-cyan-400' : 
                        req.status === 'REPROVADO' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {req.status === 'PENDENTE' ? (
                          <button 
                            onClick={() => setDetailModalId(req.id)}
                            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
                          >
                            Analisar
                          </button>
                        ) : (
                          <button className="w-9 h-9 bg-gray-800 text-gray-400 hover:text-white rounded-xl flex items-center justify-center transition-all">
                             <MoreVertical size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailModalId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#121220] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gray-900/50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-black text-2xl text-white">
                  {requests.find(r => r.id === detailModalId)?.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{requests.find(r => r.id === detailModalId)?.name}</h3>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-mono font-black text-cyan-400 tracking-widest px-2 py-0.5 bg-cyan-400/10 rounded">MAT-{requests.find(r => r.id === detailModalId)?.matricula}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 py-0.5 bg-white/5 rounded">{requests.find(r => r.id === detailModalId)?.status}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setDetailModalId(null)} className="p-2 text-gray-500 hover:text-white"><X size={24} /></button>
            </div>

            <div className="p-8 grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-1">E-mail</p>
                  <div className="flex items-center gap-2 text-sm text-gray-300"><Mail size={16} className="text-cyan-500" /> {requests.find(r => r.id === detailModalId)?.email}</div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-1">Impacto Financeiro</p>
                  <div className="flex items-center gap-2 text-sm text-green-500 font-black"><DollarSign size={16} /> + R$ 79,90 / mês</div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-1">WhatsApp</p>
                  <div className="flex items-center gap-2 text-sm text-gray-300"><Phone size={16} className="text-cyan-500" /> {requests.find(r => r.id === detailModalId)?.phone}</div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-1">Status da Fatura</p>
                  <div className="flex items-center gap-2 text-[10px] text-yellow-500 font-bold uppercase"><Zap size={14} /> Aguardando Ativação</div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-900/50 flex gap-4">
              <button 
                onClick={() => setApprovalModalId(detailModalId)}
                className="flex-1 py-4 bg-green-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg shadow-green-500/20 hover:bg-green-400 transition-all flex items-center justify-center gap-2"
              >
                <Check size={18} /> Aprovar e Faturar
              </button>
              <button 
                onClick={() => handleReject(detailModalId)}
                className="flex-1 py-4 bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <X size={18} /> Reprovar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPROVAL & BILLING MODAL */}
      {approvalModalId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#1a1a2e] border border-green-500/30 rounded-[2.5rem] p-10 space-y-8 animate-in slide-in-from-bottom-8 duration-300 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-black">Configurar Faturamento</h3>
              <p className="text-gray-500 text-sm mt-2">Ative o plano ISA 2.5 Básico para o novo parceiro.</p>
            </div>

            <div className="space-y-6">
               <div className="p-5 bg-gray-950/50 border border-white/5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-gray-500">Plano Selecionado</span>
                    <span className="text-xs font-black text-cyan-400">ISA 2.5 BÁSICO</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-gray-500">Valor Mensal</span>
                    <span className="text-lg font-black text-white">R$ 79,90</span>
                  </div>
                  <div className="h-px bg-white/5"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-gray-500">Impacto no MRR</span>
                    <div className="flex items-center gap-1 text-green-500 font-bold">
                       <TrendingUp size={14} /> +R$ 79,90
                    </div>
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1">Período de Teste Grátis</label>
                  <select 
                    value={accessDays}
                    onChange={(e) => setAccessDays(e.target.value)}
                    className="w-full bg-gray-950 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40 transition-all"
                  >
                    <option value="30">30 Dias (Recomendado)</option>
                    <option value="15">15 Dias</option>
                    <option value="0">Ativação Imediata</option>
                  </select>
               </div>

               <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${sendInvoice ? 'bg-cyan-500 border-cyan-500' : 'border-gray-700 bg-transparent'}`} onClick={() => setSendInvoice(!sendInvoice)}>
                    {sendInvoice && <Check size={14} className="text-white" />}
                  </div>
                  <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">Gerar fatura automática e enviar boas-vindas</span>
               </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={() => setApprovalModalId(null)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">Cancelar</button>
              <button 
                onClick={() => handleApprove(approvalModalId)}
                className="flex-[2] py-4 bg-green-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg shadow-green-500/30 hover:bg-green-400 transition-all"
              >
                Ativar e Faturar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
