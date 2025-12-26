
import React, { useState, useEffect, useRef } from 'react';
import { User, WhatsAppContact, SupportMessage } from '../types';
import { 
  Search, Send, MoreVertical, Phone, Video, Bot, User as UserIcon, 
  Paperclip, Smile, MessageCircle, X, Shield, Zap, CheckCircle2,
  Image as ImageIcon, FileText, Music, Link as LinkIcon
} from 'lucide-react';

const ChatWhatsApp: React.FC<{ user: User }> = ({ user }) => {
  const [contacts, setContacts] = useState<WhatsAppContact[]>([
    { 
      id: 'c1', name: 'João Carlos', phone: '+55 11 99999-0001', 
      lastMessage: 'Qual o valor do plano Pro?', time: '11:20', unread: 2, 
      mode: 'IA', avatar: 'https://picsum.photos/seed/c1/100',
      messages: [
        { id: 'm1', senderId: 'c1', senderName: 'João Carlos', senderRole: 'CUSTOMER', content: 'Olá, bom dia!', timestamp: '11:15', type: 'text', read: true },
        { id: 'm2', senderId: 'bot', senderName: 'ISA', senderRole: 'BOT', content: 'Bom dia! 😊 Como posso ajudar você hoje?', timestamp: '11:16', type: 'text', read: true },
        { id: 'm3', senderId: 'c1', senderName: 'João Carlos', senderRole: 'CUSTOMER', content: 'Qual o valor do plano Pro?', timestamp: '11:20', type: 'text', read: false },
      ]
    },
    { 
      id: 'c2', name: 'Maria Eduarda', phone: '+55 11 99999-0002', 
      lastMessage: 'Aguardando o boleto.', time: '09:45', unread: 0, 
      mode: 'IA', avatar: 'https://picsum.photos/seed/c2/100',
      messages: []
    }
  ]);

  const [selectedContactId, setSelectedContactId] = useState<string | null>(contacts[0].id);
  const [messageText, setMessageText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedContact = contacts.find(c => c.id === selectedContactId);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [selectedContactId, contacts]);

  const sendMessage = () => {
    if (!messageText.trim() || !selectedContactId) return;

    const newMessage: SupportMessage = {
      id: `m-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      read: true
    };

    setContacts(prev => prev.map(c => 
      c.id === selectedContactId 
      ? { ...c, messages: [...c.messages, newMessage], lastMessage: messageText, time: newMessage.timestamp } 
      : c
    ));
    setMessageText('');
  };

  const toggleMode = (id: string) => {
    setContacts(prev => prev.map(c => 
      c.id === id ? { ...c, mode: c.mode === 'IA' ? 'HUMANO' : 'IA' } : c
    ));
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex rounded-[3rem] overflow-hidden border border-gray-800 bg-[#0A0A14] shadow-2xl">
      
      {/* Contact List */}
      <div className="w-80 lg:w-96 border-r border-gray-800 flex flex-col bg-[#121220]">
        <div className="p-6 border-b border-gray-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Conversas</h3>
            <div className="p-2 bg-gray-900 rounded-xl text-gray-500 hover:text-white cursor-pointer">
               <MoreVertical size={18} />
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input 
              type="text" 
              placeholder="Buscar no WhatsApp..."
              className="w-full bg-gray-950 border border-white/5 rounded-2xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-800/50">
          {contacts.map(c => (
            <button 
              key={c.id}
              onClick={() => setSelectedContactId(c.id)}
              className={`w-full p-5 flex gap-4 items-center transition-all relative hover:bg-white/5 ${selectedContactId === c.id ? 'bg-cyan-500/5' : ''}`}
            >
              {selectedContactId === c.id && <div className="absolute left-0 top-0 w-1 h-full bg-cyan-500 shadow-[0_0_10px_#00D4FF]"></div>}
              <div className="relative">
                <img src={c.avatar} alt="" className="w-12 h-12 rounded-[1.2rem] border-2 border-gray-800" />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#121220] ${c.mode === 'IA' ? 'bg-purple-500' : 'bg-green-500'}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-sm truncate">{c.name}</h4>
                  <span className="text-[10px] text-gray-500">{c.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
                  {c.unread > 0 && (
                    <span className="bg-cyan-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Space */}
      <div className="flex-1 flex flex-col bg-gray-950/20">
        {selectedContact ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#121220]">
              <div className="flex items-center gap-4">
                <img src={selectedContact.avatar} alt="" className="w-10 h-10 rounded-xl" />
                <div>
                  <h4 className="text-sm font-bold">{selectedContact.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedContact.mode === 'IA' ? 'bg-purple-500 shadow-[0_0_8px_#7B42FF]' : 'bg-green-500 shadow-[0_0_8px_#22C55E]'}`}></span>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">
                      {selectedContact.mode === 'IA' ? 'IA Ativa (Semiautomático)' : 'Modo Humano'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleMode(selectedContact.id)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                    selectedContact.mode === 'IA' ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-green-500/10 border-green-500 text-green-500'
                  }`}
                >
                  {selectedContact.mode === 'IA' ? 'Assumir Humano' : 'Ativar IA'}
                </button>
                <div className="h-8 w-px bg-gray-800 mx-2"></div>
                <Phone className="text-gray-500 hover:text-white cursor-pointer" size={18} />
                <Video className="text-gray-500 hover:text-white cursor-pointer" size={18} />
                <MoreVertical className="text-gray-500 hover:text-white cursor-pointer" size={18} />
              </div>
            </div>

            {/* Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-chat-grid">
               {selectedContact.messages.map((m, i) => {
                 const isMe = m.senderRole === 'BOT' || m.senderRole === user.role;
                 return (
                   <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
                     <div className={`p-4 rounded-2xl shadow-xl text-sm max-w-[70%] relative ${
                       isMe ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none border border-white/5'
                     }`}>
                       {m.senderRole === 'BOT' && <div className="text-[8px] font-black uppercase tracking-widest text-cyan-200 mb-1 flex items-center gap-1"><Bot size={10}/> Resposta da IA</div>}
                       {m.content}
                       <div className={`text-[9px] mt-2 flex items-center gap-1 ${isMe ? 'text-cyan-200 justify-end' : 'text-gray-500'}`}>
                         {m.timestamp} {isMe && <CheckCircle2 size={10} />}
                       </div>
                     </div>
                   </div>
                 );
               })}
            </div>

            {/* Input */}
            <div className="p-6 bg-[#121220] border-t border-gray-800">
               <div className="flex items-center gap-4 bg-gray-950 border border-gray-800 rounded-[2rem] p-2 pl-6 shadow-inner">
                  <Smile className="text-gray-600 hover:text-cyan-400 cursor-pointer" size={20} />
                  <Paperclip className="text-gray-600 hover:text-cyan-400 cursor-pointer" size={20} />
                  <input 
                    type="text" 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder={selectedContact.mode === 'IA' ? "A IA está respondendo, escreva para intervir..." : "Digite sua mensagem..."}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={!messageText.trim()}
                    className={`p-3.5 rounded-2xl transition-all ${messageText.trim() ? 'bg-cyan-500 text-white shadow-lg' : 'bg-gray-800 text-gray-600'}`}
                  >
                    <Send size={18} />
                  </button>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
            <MessageCircle size={80} className="mb-4" />
            <h4 className="text-xl font-bold uppercase tracking-widest">Selecione uma conversa</h4>
          </div>
        )}
      </div>

      <style>{`
        .bg-chat-grid {
          background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default ChatWhatsApp;
