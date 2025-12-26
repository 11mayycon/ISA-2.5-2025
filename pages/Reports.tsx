
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Download, Calendar, ArrowUpRight } from 'lucide-react';

const data = [
  { name: 'Encaminhado Humano', value: 15 },
  { name: 'Resolvido por IA', value: 85 },
];

const COLORS = ['#00D4FF', '#7B42FF'];

const Reports: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Relatórios Estratégicos</h2>
          <p className="text-gray-500 text-sm">Visualize o impacto da IA no seu atendimento.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#121220] border border-gray-800 rounded-xl text-xs font-bold hover:border-cyan-500/50 transition-all">
            <Calendar size={16} /> Outubro, 2023
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all">
            <Download size={16} /> Gerar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Retention Chart */}
        <div className="lg:col-span-1 bg-[#121220] border border-gray-800 rounded-[2.5rem] p-8">
          <h3 className="font-bold text-center mb-8">Taxa de Resolução</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={10}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 text-center">
            <p className="text-3xl font-black text-cyan-400">85%</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Sucesso da IA</p>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-8 rounded-[2rem]">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <ArrowUpRight size={24} />
                </div>
                <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+24%</span>
              </div>
              <h4 className="text-sm font-bold text-gray-400 mb-1">Satisfação do Cliente</h4>
              <p className="text-3xl font-black">4.9/5.0</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-8 rounded-[2rem]">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <ArrowUpRight size={24} />
                </div>
                <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+18%</span>
              </div>
              <h4 className="text-sm font-bold text-gray-400 mb-1">Economia de Tempo</h4>
              <p className="text-3xl font-black">128h / mês</p>
            </div>
          </div>

          <div className="bg-[#121220] border border-gray-800 rounded-[2rem] p-8">
            <h3 className="font-bold mb-6">Top 5 Intenções da IA</h3>
            <div className="space-y-6">
              {[
                { label: 'Informações de Preço', value: 45, color: 'bg-cyan-500' },
                { label: 'Suporte Técnico', value: 25, color: 'bg-purple-500' },
                { label: 'Agendamento', value: 15, color: 'bg-blue-500' },
                { label: 'Cancelamento', value: 8, color: 'bg-red-500' },
                { label: 'Outros', value: 7, color: 'bg-gray-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-400 uppercase tracking-widest">{item.label}</span>
                    <span className="text-white">{item.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
