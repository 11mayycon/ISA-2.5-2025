
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MessageSquare, Bot, Users, Activity, TrendingUp, TrendingDown, LayoutPanelLeft, Bell, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { User, UserRole, Notice } from '../types';
import { MetricSkeleton, ChartSkeleton } from '../components/Skeletons';
import EmptyState from '../components/EmptyState';

const chartData = [
  { name: 'Seg', msg: 400, bots: 240 },
  { name: 'Ter', msg: 300, bots: 139 },
  { name: 'Qua', msg: 200, bots: 980 },
  { name: 'Qui', msg: 278, bots: 390 },
  { name: 'Sex', msg: 189, bots: 480 },
  { name: 'Sáb', msg: 239, bots: 380 },
  { name: 'Dom', msg: 349, bots: 430 },
];

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [urgentNotice, setUrgentNotice] = useState<Notice | null>(null);

  useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => {
      setLoading(false);
      setHasData(true);
      
      // Check for urgent notices
      const storedNotices = JSON.parse(localStorage.getItem('isa_notices') || '[]');
      const urgent = storedNotices.find((n: Notice) => n.type === 'URGENTE' && !n.readBy.includes(user.id));
      if (urgent) setUrgentNotice(urgent);
    }, 1500);
    return () => clearTimeout(timer);
  }, [user.id]);

  const markNoticeRead = (id: string) => {
    const stored = JSON.parse(localStorage.getItem('isa_notices') || '[]');
    const updated = stored.map((n: Notice) => {
      if (n.id === id) return { ...n, readBy: [...n.readBy, user.id] };
      return n;
    });
    localStorage.setItem('isa_notices', JSON.stringify(updated));
    setUrgentNotice(null);
  };

  const stats = [
    { label: 'Total de Mensagens', value: '12.4k', trend: 12, icon: <MessageSquare className="text-blue-400" /> },
    { label: 'Conversas por IA', value: '8.2k', trend: 8, icon: <Bot className="text-purple-400" /> },
    { label: 'Novos Leads', value: '456', trend: -3, icon: <Users className="text-cyan-400" /> },
    { label: 'Taxa de Retenção', value: '94%', trend: 2, icon: <Activity className="text-green-400" /> },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-14 w-64 bg-gray-800/50 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <MetricSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="h-full flex items-center justify-center">
        <EmptyState 
          icon={LayoutPanelLeft} 
          title="Nenhum dado encontrado" 
          description="Sua conta ainda não gerou métricas. Conecte um bot do WhatsApp para começar a monitorar."
          actionLabel="Configurar WhatsApp"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      
      {/* Urgent Notice Modal */}
      {urgentNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
           <div className="w-full max-w-lg bg-[#1a1a2e] border border-red-500/30 rounded-[3rem] p-10 text-center space-y-8 shadow-[0_0_80px_rgba(239,68,68,0.2)] animate-in zoom-in duration-300">
             <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center text-red-500 mx-auto mb-6">
               <AlertTriangle size={48} />
             </div>
             <div className="space-y-3">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Aviso Urgente</span>
               <h3 className="text-3xl font-black">{urgentNotice.title}</h3>
               <p className="text-gray-400 leading-relaxed">{urgentNotice.content}</p>
             </div>
             <button 
               onClick={() => markNoticeRead(urgentNotice.id)}
               className="w-full py-5 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl transition-all"
             >
               Entendido, marcar como lido
             </button>
           </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold mb-1">Olá, {user.name} 👋</h1>
        <p className="text-gray-500 text-sm">Aqui está o que está acontecendo na sua plataforma hoje.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#121220] border border-gray-800 p-6 rounded-2xl hover:border-cyan-500/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-gray-900 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stat.trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {Math.abs(stat.trend)}%
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#121220] border border-gray-800 p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold">Volume de Mensagens</h3>
            <select className="bg-gray-900 border border-gray-800 text-xs rounded-lg px-2 py-1 outline-none">
              <option>Últimos 7 dias</option>
              <option>Último mês</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', borderRadius: '12px' }}
                  itemStyle={{ color: '#00D4FF' }}
                />
                <Area type="monotone" dataKey="msg" stroke="#00D4FF" fillOpacity={1} fill="url(#colorMsg)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#121220] border border-gray-800 p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold">Interações por Bot</h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span> IA
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span> Humano
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', borderRadius: '12px' }}
                />
                <Bar dataKey="bots" fill="#7B42FF" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="msg" fill="#00D4FF" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Latest Activity */}
      <div className="bg-[#121220] border border-gray-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="font-bold">Atividades Recentes</h3>
          <button className="text-cyan-400 text-xs font-bold hover:underline">Ver tudo</button>
        </div>
        <div className="divide-y divide-gray-800">
          {[
            { user: 'João Silva', action: 'Iniciou uma nova conversa', time: 'Há 5 minutos', status: 'IA Ativa' },
            { user: 'Maria Souza', action: 'Solicitou atendimento humano', time: 'Há 12 minutos', status: 'Pendente' },
            { user: 'Ricardo Alencar', action: 'Novo cadastro realizado', time: 'Há 45 minutos', status: 'Concluído' },
          ].map((item, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold">
                  {item.user.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold">{item.user}</p>
                  <p className="text-xs text-gray-500">{item.action}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">{item.time}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  item.status === 'IA Ativa' ? 'bg-cyan-500/10 text-cyan-400' : 
                  item.status === 'Pendente' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
