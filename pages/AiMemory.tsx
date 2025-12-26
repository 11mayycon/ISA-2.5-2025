
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { 
  Save, Bot, Sparkles, Send, BrainCircuit, 
  MessageSquare, Info, Zap, Terminal, Code
} from 'lucide-react';

const AiMemory: React.FC<{ user: User }> = ({ user }) => {
  const storageKey = `isa_ai_behavior_${user.matricula}`;
  
  // Estado para o prompt de comportamento único
  const [behavior, setBehavior] = useState<string>(
    `Você é a ISA, a inteligência operacional da minha empresa. 
Seu objetivo é atender os clientes de forma profissional e eficiente.

Siga estas diretrizes:
1. Seja sempre cordial e use emojis moderadamente.
2. Se o cliente perguntar sobre preços, informe que nossos planos começam em R$ 299.
3. Se não souber uma resposta, peça para o cliente aguardar que um humano irá assumir.`
  );

  const [previewMsg, setPreviewMsg] = useState('');
  const [previewChat, setPreviewChat] = useState<{sender: string, text: string}[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setBehavior(stored);
  }, [storageKey]);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem(storageKey, behavior);
    setTimeout(() => {
      setIsSaving(false);
      // Feedback visual de sucesso opcional aqui
    }, 800);
  };

  const simulateResponse = () => {
    if (!previewMsg.trim()) return;
    const newChat = [...previewChat, { sender: 'VOCÊ', text: previewMsg }];
    setPreviewChat(newChat);
    setPreviewMsg('');
    
    // Simulação de resposta baseada no prompt (mock)
    setTimeout(() => {
      setPreviewChat(prev => [...prev, { 
        sender: 'ISA', 
        text: `[Simulação baseada no seu novo comando]: Entendi perfeitamente como devo me comportar! A partir de agora, seguirei as instruções: "${behavior.substring(0, 60)}..." para responder à sua dúvida: "${previewMsg}".` 
      }]);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700 pb-20">
      
      {/* Editor Panel - Single Card */}
      <div className="flex-1 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <BrainCircuit className="text-cyan-400" /> Memória de Comportamento
            </h2>
            <p className="text-gray-500 text-sm mt-1">Defina exatamente como a ISA deve pensar, agir e responder.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
          >
            {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={18} />}
            {isSaving ? 'Salvando...' : 'Salvar Comportamento'}
          </button>
        </div>

        <div className="bg-[#121220] border border-gray-800 rounded-[3rem] p-1 shadow-2xl overflow-hidden group focus-within:border-cyan-500/50 transition-all">
          <div className="flex items-center gap-3 px-8 py-4 bg-gray-900/50 border-b border-gray-800">
            <Terminal size={16} className="text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Diretrizes da Inteligência (Prompt Mestre)</span>
          </div>
          <textarea 
            value={behavior}
            onChange={(e) => setBehavior(e.target.value)}
            placeholder="Ex: Você é um assistente de vendas empolgado. Sempre tente fechar a venda e use muitos emojis..."
            className="w-full h-[500px] bg-transparent p-8 text-sm md:text-base leading-relaxed text-gray-200 focus:outline-none resize-none font-mono"
          />
          <div className="px-8 py-4 bg-gray-900/30 border-t border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              <Code size={12} /> {behavior.length} caracteres
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Editor Ativo</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-3xl flex items-start gap-4">
          <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400">
            <Info size={20} />
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            <strong className="text-cyan-400">Dica Pro:</strong> Seja específico. Em vez de dizer "seja amigável", diga "use um tom acolhedor e trate o cliente pelo primeiro nome sempre que possível". A ISA segue rigorosamente o que você escreve neste card.
          </p>
        </div>
      </div>

      {/* Preview Section - Sticky Chat */}
      <div className="w-full lg:w-[420px]">
        <div className="sticky top-8 bg-[#121220] border border-gray-800 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-[700px]">
           <div className="p-6 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 relative">
                 <Bot size={24} />
                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121220]"></div>
               </div>
               <div>
                 <h4 className="text-sm font-bold">Laboratório de Testes</h4>
                 <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Homologação de Comportamento</p>
               </div>
             </div>
             <button 
              onClick={() => setPreviewChat([])}
              className="text-[10px] text-gray-500 hover:text-white uppercase font-black tracking-widest transition-colors"
             >
               Limpar
             </button>
           </div>

           <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-chat-grid">
              {previewChat.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-20">
                  <div className="p-6 bg-white/5 rounded-full mb-6">
                    <Sparkles size={48} className="text-cyan-400" />
                  </div>
                  <h5 className="text-sm font-bold mb-2">Aguardando seu comando</h5>
                  <p className="text-[10px] uppercase font-black tracking-widest">Escreva uma mensagem abaixo para ver como a ISA reagirá ao seu novo comportamento.</p>
                </div>
              ) : (
                previewChat.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.sender === 'VOCÊ' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                    <span className="text-[9px] font-black text-gray-600 mb-1 uppercase tracking-widest ml-1 mr-1">{msg.sender}</span>
                    <div className={`p-4 rounded-3xl text-xs max-w-[85%] shadow-xl ${
                      msg.sender === 'VOCÊ' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none border border-white/5'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
           </div>

           <div className="p-6 bg-gray-900 border-t border-gray-800">
             <div className="flex items-center gap-3 bg-gray-950 border border-gray-800 rounded-2xl p-2 pl-5 shadow-inner">
               <input 
                type="text" 
                value={previewMsg}
                onChange={(e) => setPreviewMsg(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && simulateResponse()}
                placeholder="Simule uma dúvida de cliente..." 
                className="flex-1 bg-transparent border-none focus:ring-0 text-xs py-2"
               />
               <button 
                onClick={simulateResponse}
                disabled={!previewMsg.trim()}
                className="p-3 bg-cyan-500 rounded-xl text-white shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all disabled:opacity-50"
               >
                 <Send size={16} />
               </button>
             </div>
           </div>
        </div>
      </div>

      <style>{`
        .bg-chat-grid {
          background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        textarea::placeholder {
          color: rgba(156, 163, 175, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AiMemory;
