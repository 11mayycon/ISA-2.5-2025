
import React, { useState, useEffect } from 'react';
import { MOCK_CONVERSATIONS } from '../constants';
import { Search, Send, MoreVertical, Phone, Video, Bot, User as UserIcon, Paperclip, Smile, MessageCircle, X as CloseIcon } from 'lucide-react';
import { ChatListSkeleton } from '../components/Skeletons';
import EmptyState from '../components/EmptyState';

const Conversations: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState(MOCK_CONVERSATIONS[0]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<typeof MOCK_CONVERSATIONS>([]);
  const [showMobileWarning, setShowMobileWarning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setConversations(MOCK_CONVERSATIONS);
      setSelectedChat(MOCK_CONVERSATIONS[0]);
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-[calc(100vh-12rem)] min-h-[500px] flex rounded-3xl overflow-hidden border border-gray-800 bg-[#0A0A14] shadow-2xl relative">
      
      {/* Mobile Overlay Warning */}
      {showMobileWarning && (
        <div className="lg:hidden absolute inset-0 z-50 bg-[#0A0A14]/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
          <div className="relative glass p-8 rounded-[2.5rem] border border-white/10 max-w-sm w-full">
            <button 
              onClick={() => setShowMobileWarning(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Fechar aviso"
            >
              <CloseIcon size={20} />
            </button>
            
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-cyan-500/10 rounded-3xl text-cyan-400 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                <Bot size={48} className="animate-float" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4 neon-text">Experiência Otimizada</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              A interface de conversas avançadas é otimizada para Desktop. Por favor, acesse através de um computador para gerenciar suas interações com total precisão.
            </p>
            
            <button 
              onClick={() => setShowMobileWarning(false)}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold text-white shadow-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all"
            >
              Entendi, continuar mesmo assim
            </button>
          </div>
        </div>
      )}

      {/* Chat List */}
      <div className="w-80 lg:w-96 border-r border-gray-800 flex flex-col bg-[#121220]">
        <div className="p-5 border-b border-gray-800">
          <h3 className="text-xl font-bold mb-4">Mensagens</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar contato..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-800">
          {loading ? (
            <ChatListSkeleton />
          ) : conversations.length > 0 ? (
            conversations.map((chat) => (
              <button 
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full p-4 flex gap-4 items-center hover:bg-white/5 transition-all text-left ${selectedChat?.id === chat.id ? 'bg-white/5 border-l-4 border-cyan-500' : ''}`}
              >
                <div className="relative">
                  <img src={chat.avatar} alt="" className="w-12 h-12 rounded-full border-2 border-gray-800" />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#121220] ${chat.activeType === 'IA' ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-sm truncate">{chat.name}</h4>
                    <span className="text-[10px] text-gray-500">{chat.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="bg-cyan-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">Nenhuma conversa encontrada.</div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-950/50">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-gray-800 mb-4"></div>
            <div className="w-48 h-4 bg-gray-800 rounded mb-2"></div>
            <div className="w-32 h-3 bg-gray-800 rounded"></div>
          </div>
        ) : selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#121220]">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={selectedChat.avatar} alt="" className="w-10 h-10 rounded-full" />
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#121220] ${selectedChat.activeType === 'IA' ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                </div>
                <div>
                  <h4 className="font-bold text-sm">{selectedChat.name}</h4>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1 uppercase tracking-widest font-bold">
                    {selectedChat.activeType === 'IA' ? (
                      <>
                        <Bot size={10} className="text-purple-500" />
                        Inteligência Ativa
                      </>
                    ) : (
                      <>
                        <UserIcon size={10} className="text-green-500" />
                        Humano no Controle
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-500">
                <button className="hover:text-white"><Phone size={20} /></button>
                <button className="hover:text-white"><Video size={20} /></button>
                <div className="w-px h-6 bg-gray-800"></div>
                <button className="hover:text-white"><MoreVertical size={20} /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
              <div className="mx-auto bg-gray-900/50 px-3 py-1 rounded-full text-[10px] text-gray-500 uppercase tracking-widest font-bold border border-gray-800">
                Ontem
              </div>

              {/* Client Message */}
              <div className="max-w-[70%] bg-gray-800 rounded-2xl rounded-tl-none p-4 text-sm self-start shadow-sm">
                Olá, gostaria de saber quais são os planos disponíveis para a ISA 2.5?
                <div className="text-[10px] text-gray-500 mt-2 text-right">14:20</div>
              </div>

              {/* IA Message */}
              <div className="max-w-[70%] bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl rounded-tr-none p-4 text-sm self-end shadow-[0_4px_15px_rgba(123,66,255,0.2)]">
                <div className="flex items-center gap-1 text-[10px] font-black text-purple-200 uppercase mb-2">
                  <Bot size={12} />
                  ISA Assistente
                </div>
                Olá! Que prazer atendê-lo. Temos 3 planos principais: Starter, Pro e Enterprise. O Plano Pro é o mais popular, incluindo integração total com IA e 10 instâncias de WhatsApp. Gostaria que eu detalhasse os valores?
                <div className="text-[10px] text-purple-300 mt-2 text-right">14:20</div>
              </div>

              <div className="mx-auto bg-gray-900/50 px-3 py-1 rounded-full text-[10px] text-gray-500 uppercase tracking-widest font-bold border border-gray-800">
                Hoje
              </div>

              {/* Client Message */}
              <div className="max-w-[70%] bg-gray-800 rounded-2xl rounded-tl-none p-4 text-sm self-start shadow-sm">
                {selectedChat.lastMessage}
                <div className="text-[10px] text-gray-500 mt-2 text-right">{selectedChat.time}</div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-800 bg-[#121220]">
              <div className="flex items-center gap-4 bg-gray-950/50 border border-gray-800 rounded-2xl px-4 py-2">
                <button className="text-gray-500 hover:text-cyan-400"><Smile size={20} /></button>
                <button className="text-gray-500 hover:text-cyan-400"><Paperclip size={20} /></button>
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva sua mensagem..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
                />
                <button 
                  className={`p-2.5 rounded-xl transition-all ${message ? 'bg-cyan-500 text-white shadow-lg' : 'bg-gray-800 text-gray-600'}`}
                  disabled={!message}
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-3 flex justify-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">IA Inteligente</span>
                </div>
                <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 cursor-pointer transition-all">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Assumir Controle</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-20">
            <EmptyState 
              icon={MessageCircle} 
              title="Selecione uma conversa" 
              description="Escolha um dos contatos à esquerda para visualizar o histórico de mensagens e interagir em tempo real."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;
