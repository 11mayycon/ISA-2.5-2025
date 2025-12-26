
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { 
  DollarSign, TrendingUp, Users, Target, Calendar, ArrowUpRight, 
  ArrowDownRight, Download, Filter, MoreVertical, CreditCard, PieChart as PieChartIcon
} from 'lucide-react';
import { User, Invoice } from '../types';

const revenueData = [
  { name: 'Jul', mrr: 1800, churn: 200 },
  { name: 'Ago', mrr: 2100, churn: 150 },
  { name: 'Set', mrr: 2400, churn: 300 },
  { name: 'Out', mrr: 3200, churn: 100 },
  { name: 'Nov', mrr: 3800, churn: 250 },
  { name: 'Dez', mrr: 4076, churn: 79 },
];

const FinancialDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeClients, setActiveClients] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedRequests = JSON.parse(localStorage.getItem('isa_requests') || '[]');
      const approved = storedRequests.filter((r: any) => r.status === 'APROVADO');
      setActiveClients(approved);
      
      // Simulate some invoices
      setInvoices([
        { id: 'INV-001', userId: 'req-1', userName: 'Maicon Silva', amount: 79.90, status: 'PAGO', dueDate: '2025-12-25', description: 'ISA 2.5 Básico', createdAt: '2025-11-25' },
        { id: 'INV-002', userId: 'req-2', userName: 'Empresa Teste', amount: 79.90, status: 'PENDENTE', dueDate: '2026-01-05', description: 'ISA 2.5 Básico', createdAt: '2025-12-05' },
      ]);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const mrr = activeClients.length * 79.90;
  const arr = mrr * 12;

  const stats = [
    { label: 'MRR (Recorrência Mensal)', value: `R$ ${mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, trend: 12, icon: <DollarSign className="text-green-400" /> },
    { label: 'ARR (Projeção Anual)', value: `R$ ${arr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, trend: 12, icon: <TrendingUp className="text-cyan-400" /> },
    { label: 'Clientes Ativos', value: activeClients.length.toString(), trend: 5, icon: <Users className="text-purple-400" /> },
    { label: 'Churn Rate (Mensal)', value: '1.8%', trend: -2, icon: <PieChartIcon className="text-red-400" /> },
  ];

  if (loading) {
    return <div className="p-20 flex justify-center"><div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <DollarSign className="text-cyan-400" /> Inteligência Financeira
          </h2>
          <p className="text-gray-500 text-sm mt-1">Acompanhamento de receita recorrente e saúde do negócio.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#121220] border border-gray-800 rounded-xl text-xs font-bold hover:border-cyan-500/50 transition-all">
            <Download size={16} /> Exportar Relatório
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all">
            <Calendar size={16} /> Dezembro, 2025
          </button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#121220] border border-gray-800 p-6 rounded-[2rem] hover:border-cyan-500/40 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 blur-3xl rounded-full -mr-10 -mt-10"></div>
             <div className="flex justify-between items-start mb-6">
               <div className="p-4 bg-gray-900 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
                 {stat.icon}
               </div>
               <div className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-full ${stat.trend > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                 {stat.trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                 {Math.abs(stat.trend)}%
               </div>
             </div>
             <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
             <h3 className="text-2xl font-black text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[#121220] border border-gray-800 rounded-[3rem] p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp size={18} className="text-cyan-400" /> Crescimento de MRR
            </h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase">
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div> Receita
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase">
                <div className="w-2 h-2 rounded-full bg-red-500/50"></div> Churn
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A14', border: '1px solid #1f2937', borderRadius: '16px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="mrr" stroke="#00D4FF" fillOpacity={1} fill="url(#colorMrr)" strokeWidth={4} />
                <Area type="monotone" dataKey="churn" stroke="#ef4444" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-gradient-to-br from-[#1e1e38] to-[#121220] border border-cyan-500/20 rounded-[3rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
              <Target size={120} />
            </div>
            <div className="relative z-10">
              <h4 className="text-xs font-black text-cyan-400 uppercase tracking-[0.3em] mb-4">Meta Anual 2026</h4>
              <p className="text-3xl font-black mb-2">R$ 100k</p>
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="text-gray-400">Progresso</span>
                  <span className="text-white">R$ 24.000 (24%)</span>
                </div>
                <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 w-[24%] shadow-[0_0_15px_#00D4FF]"></div>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Faltam <span className="text-white font-bold">74 novos clientes</span> ativos de R$ 79,90 para atingir sua meta. Projeção atual indica conclusão em Julho/26.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#121220] border border-gray-800 rounded-[3rem] p-8">
            <h4 className="font-bold mb-6 flex items-center gap-2">
              <CreditCard size={18} className="text-purple-400" /> Transações Recentes
            </h4>
            <div className="space-y-4">
              {invoices.map((inv, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-950/50 border border-white/5 rounded-2xl group hover:border-cyan-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${inv.status === 'PAGO' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {inv.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">{inv.userName}</p>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{inv.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-white">R$ {inv.amount.toFixed(2)}</p>
                    <p className="text-[9px] text-gray-600">{new Date(inv.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Ver todas as faturas</button>
            </div>
          </div>
        </div>
      </div>

      {/* CLIENT BREAKDOWN TABLE */}
      <div className="bg-[#121220] border border-gray-800 rounded-[3rem] overflow-hidden shadow-2xl">
         <div className="p-8 border-b border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900/30">
            <h3 className="font-bold flex items-center gap-3">
               <Users size={18} className="text-cyan-400" /> Receita Detalhada por Cliente
            </h3>
            <div className="flex gap-4">
               <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <select className="bg-gray-950 border border-gray-800 rounded-xl py-2 pl-9 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-cyan-500/50">
                    <option>Todos os Status</option>
                    <option>Ativos</option>
                    <option>Inadimplentes</option>
                  </select>
               </div>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-[9px] text-gray-500 font-black uppercase tracking-widest border-b border-gray-800">
                     <th className="px-8 py-4">Cliente / Matrícula</th>
                     <th className="px-8 py-4">Status Financeiro</th>
                     <th className="px-8 py-4">Valor Mensal</th>
                     <th className="px-8 py-4">Receita Acumulada</th>
                     <th className="px-8 py-4">Próximo Venc.</th>
                     <th className="px-8 py-4 text-right">Ações</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-800/50">
                  {activeClients.map((client) => (
                    <tr key={client.id} className="hover:bg-white/5 transition-colors">
                       <td className="px-8 py-4">
                          <div className="flex items-center gap-4">
                             <div className="w-8 h-8 rounded-lg bg-gray-900 border border-white/5 flex items-center justify-center font-bold text-[10px] text-cyan-400">
                                {client.matricula}
                             </div>
                             <div>
                                <p className="text-sm font-bold text-white">{client.name}</p>
                                <p className="text-[9px] text-gray-500">{client.email}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-4">
                          <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                             client.subscriptionStatus === 'ATIVO' ? 'bg-green-500/10 text-green-500' : 'bg-cyan-500/10 text-cyan-400'
                          }`}>
                             {client.subscriptionStatus || 'TESTE'}
                          </span>
                       </td>
                       <td className="px-8 py-4 text-xs font-black text-white">R$ 79,90</td>
                       <td className="px-8 py-4 text-xs font-black text-white">R$ {(client.totalRevenueGenerated || 159.80).toFixed(2)}</td>
                       <td className="px-8 py-4">
                          <div className="flex items-center gap-2 text-gray-400 text-xs">
                             <Calendar size={12} /> 25/01/2026
                          </div>
                       </td>
                       <td className="px-8 py-4 text-right">
                          <button className="p-2 text-gray-500 hover:text-white transition-colors">
                             <MoreVertical size={18} />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
