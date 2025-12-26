
import React, { useState } from 'react';
import { Save, Bot, Globe, Smartphone, ShieldCheck, Zap } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Geral');

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Navigation */}
        <div className="w-full md:w-64 space-y-2">
          {[
            { id: 'Geral', icon: <Globe size={18} /> },
            { id: 'Inteligência Artificial', icon: <Bot size={18} /> },
            { id: 'WhatsApp Connect', icon: <Smartphone size={18} /> },
            { id: 'Segurança', icon: <ShieldCheck size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id 
                ? 'bg-cyan-500 text-white shadow-lg' 
                : 'text-gray-500 hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.id}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#121220] border border-gray-800 rounded-[2rem] p-8">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold">{activeTab}</h3>
            <button className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold transition-all">
              <Save size={16} /> Salvar Alterações
            </button>
          </div>

          <div className="space-y-8">
            {activeTab === 'Geral' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nome da Instância</label>
                  <input type="text" defaultValue="ISA 2.5 - Matriz" className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Idioma Padrão</label>
                  <select className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-cyan-500">
                    <option>Português (Brasil)</option>
                    <option>English</option>
                    <option>Español</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-2xl">
                  <div>
                    <h4 className="text-sm font-bold">Modo Noturno</h4>
                    <p className="text-xs text-gray-500">Forçar tema escuro em todos os usuários</p>
                  </div>
                  <div className="w-12 h-6 bg-cyan-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Inteligência Artificial' && (
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-3xl flex items-center gap-4">
                  <Zap size={32} className="text-purple-500" />
                  <div>
                    <h4 className="font-bold">Motor Gemini 1.5 Pro</h4>
                    <p className="text-xs text-gray-400">Ativado e processando com latência ultrabaixa.</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Instruções do Sistema (Prompt)</label>
                  <textarea rows={6} className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-purple-500 resize-none" defaultValue="Você é a ISA, assistente operacional inteligente. Sua voz deve ser profissional, prestativa e técnica quando necessário..."></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Criatividade (Temperature)</label>
                  <input type="range" className="w-full accent-purple-500" min="0" max="100" />
                  <div className="flex justify-between text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                    <span>Focado</span>
                    <span>Criativo</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'WhatsApp Connect' && (
              <div className="space-y-6">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold">Respostas Automáticas</h4>
                    <div className="w-10 h-5 bg-cyan-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-6">Quando ativado, a ISA responderá instantaneamente a qualquer nova mensagem.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Atraso na Resposta (Segundos)</label>
                  <input type="number" defaultValue="2" className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Webhook URL</label>
                  <input type="text" placeholder="https://api.seusistema.com/webhook" className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-cyan-500" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
