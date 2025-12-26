
import React from 'react';
import { User, UserRole } from '../types';
import { Shield, Mail, Key, Phone, Calendar, MapPin, CreditCard, DollarSign, ExternalLink, Zap } from 'lucide-react';

const Profile: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="relative h-56 rounded-[3rem] bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 grid-bg opacity-30"></div>
        <div className="absolute -bottom-16 left-12">
          <div className="p-3 bg-[#0A0A14] rounded-[2.5rem]">
            <div className="w-36 h-36 rounded-[2rem] bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center text-5xl font-black text-white shadow-2xl relative">
              {user.name.charAt(0)}
              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-green-500 rounded-full border-4 border-[#0A0A14] flex items-center justify-center">
                 <Zap size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-16 px-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2">{user.name}</h1>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-widest">
              <Shield size={12} /> {user.role.replace('_', ' ')}
            </span>
            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">ID: {user.matricula || user.id.substring(0, 8)}</span>
          </div>
        </div>
        <button className="px-10 py-4 bg-[#121220] border border-gray-800 hover:border-cyan-500/50 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl">
          Configurações da Conta
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        {/* Profile Info */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-[#121220] border border-gray-800 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
              <h3 className="font-black text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">Meus Dados</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="w-10 h-10 rounded-xl bg-gray-950 flex items-center justify-center text-cyan-400"><Mail size={18} /></div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-600">Email</p>
                    <p className="text-sm font-bold text-white truncate max-w-[150px]">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="w-10 h-10 rounded-xl bg-gray-950 flex items-center justify-center text-cyan-400"><Phone size={18} /></div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-600">Telefone</p>
                    <p className="text-sm font-bold text-white">+55 (11) 99888-7766</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="w-10 h-10 rounded-xl bg-gray-950 flex items-center justify-center text-cyan-400"><MapPin size={18} /></div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-600">Localização</p>
                    <p className="text-sm font-bold text-white">São Paulo, BR</p>
                  </div>
                </div>
              </div>
           </div>

           <div className="bg-[#121220] border border-gray-800 rounded-[2.5rem] p-8 space-y-4 shadow-xl">
              <h3 className="font-black text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">Segurança Ativa</h3>
              <button className="w-full flex items-center justify-between p-4 bg-gray-950 rounded-2xl border border-white/5 hover:border-purple-500/40 transition-all group">
                <div className="flex items-center gap-3">
                  <Key size={16} className="text-purple-500" />
                  <span className="text-xs font-bold">Credenciais</span>
                </div>
                <div className="text-[8px] font-black text-gray-600 uppercase">Alterar</div>
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-gray-950 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-green-500" />
                  <span className="text-xs font-bold">Autenticação 2FA</span>
                </div>
                <div className="text-[8px] font-black text-green-500 uppercase">Seguro</div>
              </button>
           </div>
        </div>

        {/* Subscription / Billing Area */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-gradient-to-br from-[#1a1a2e] to-[#121220] border border-cyan-500/20 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
                 <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                       <CreditCard className="text-cyan-400" />
                       <h3 className="text-xl font-black italic">MINHA ASSINATURA</h3>
                    </div>
                    
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Plano Operacional</p>
                       <h4 className="text-2xl font-black text-white flex items-center gap-3">
                         ISA 2.5 BÁSICO
                         <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] rounded-full border border-green-500/20">ATIVO</span>
                       </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       <div>
                          <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Valor Mensal</p>
                          <p className="text-xl font-black text-white">R$ 79,90</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Próxima Cobrança</p>
                          <p className="text-xl font-black text-cyan-400">25/01/2026</p>
                       </div>
                    </div>
                 </div>

                 <div className="md:w-64 space-y-4">
                    <button className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2">
                       <ExternalLink size={16} /> Ver Faturas
                    </button>
                    <button className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all">
                       Alterar Plano
                    </button>
                    <p className="text-[9px] text-center text-gray-600 font-bold uppercase">Ciclo mensal via Cartão • **** 8821</p>
                 </div>
              </div>
           </div>

           <div className="bg-[#121220] border border-gray-800 rounded-[3rem] p-8 shadow-xl">
              <div className="flex justify-between items-center mb-8">
                 <h4 className="font-bold flex items-center gap-2">
                    <History size={18} className="text-purple-400" /> Histórico de Faturamento
                 </h4>
                 <button className="text-[10px] font-black uppercase text-cyan-400 hover:underline">Ver tudo</button>
              </div>
              <div className="space-y-4">
                 {[
                   { date: '25/12/2025', desc: 'Mensalidade ISA 2.5', val: 'R$ 79,90', status: 'PAGO' },
                   { date: '25/11/2025', desc: 'Período de Teste', val: 'R$ 0,00', status: 'TESTE' },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-5 bg-gray-950/50 border border-white/5 rounded-3xl hover:border-cyan-500/20 transition-all group">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-gray-900 rounded-xl text-gray-500 group-hover:text-cyan-400 transition-colors">
                            <Calendar size={18} />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-white">{item.desc}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">{item.date}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-black text-white">{item.val}</p>
                         <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${item.status === 'PAGO' ? 'bg-green-500/10 text-green-500' : 'bg-cyan-500/10 text-cyan-400'}`}>{item.status}</span>
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

export default Profile;
