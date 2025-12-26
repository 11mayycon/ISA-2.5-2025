
import React, { useState, useEffect, useRef } from 'react';
import { SupportTicket, SupportMessage, User, UserRole } from '../types';
import { 
  Plus, MessageCircle, Send, Paperclip, Smile, MoreVertical, 
  Search, Clock, ChevronRight, X, User as UserIcon,
  CheckCircle2, AlertCircle, History, Shield, 
  Users, Bot, ArrowRight, Zap, Loader2, MessageSquare, Star, LogOut
} from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { useNotifications } from '../context/NotificationContext';

const Support: React.FC<{ user: User }> = ({ user }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const isAdmin = user.role === UserRole.SUPER_DONO || user.role === UserRole.ADMIN;
  const { addNotification } = useNotifications();

  const [newTicketData, setNewTicketData] = useState({
    subject: '',
    category: 'Problema Técnico',
    priority: 'NORMAL' as const,
    description: ''
  });

  // Carregar tickets inicial
  useEffect(() => {
    const syncTickets = () => {
      const stored = localStorage.getItem('isa_tickets');
      if (stored) {
        let loaded = JSON.parse(stored);
        setTickets(loaded);
      }
      setLoading(false);
    };
    syncTickets();
    const interval = setInterval(syncTickets, 3000);
    return () => clearInterval(interval);
  }, []);

  // Selecionar ticket automaticamente para o cliente se ele tiver um ativo/pendente
  useEffect(() => {
    if (!isAdmin && !selectedTicketId) {
      const active = tickets.find(t => t.clientId === user.id && (t.status === 'EM_ATENDIMENTO' || t.status === 'PENDENTE'));
      if (active) {
        setSelectedTicketId(active.id);
      }
    }
  }, [tickets, isAdmin, selectedTicketId, user.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedTicketId, tickets]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setIsActionMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveTickets = (updated: SupportTicket[]) => {
    localStorage.setItem('isa_tickets', JSON.stringify(updated));
    setTickets(updated);
  };

  const createTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = `TKT-${Date.now()}`;
    const newTicket: SupportTicket = {
      id: ticketId,
      clientId: user.id,
      clientName: user.name,
      clientMatricula: user.matricula || 'N/A',
      subject: newTicketData.subject,
      category: newTicketData.category,
      priority: newTicketData.priority,
      status: 'PENDENTE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      unreadCountAdmin: 1,
      unreadCountClient: 0,
      messages: [{
        id: `MSG-${Date.now()}`,
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        content: newTicketData.description,
        timestamp: new Date().toISOString(),
        type: 'text',
        read: false
      }]
    };
    
    const allStored = JSON.parse(localStorage.getItem('isa_tickets') || '[]');
    const updated = [newTicket, ...allStored];
    saveTickets(updated);
    
    addNotification({
      type: 'request',
      title: 'Novo Chamado',
      message: `${user.name} abriu um ticket: "${newTicketData.subject}"`,
      targetRoles: [UserRole.ADMIN, UserRole.SUPER_DONO]
    });

    setIsNewTicketModalOpen(false);
    setSelectedTicketId(ticketId);
  };

  const handleStartService = (ticketId: string) => {
    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'EM_ATENDIMENTO' as const,
          assignedTo: user.id,
          assignedName: user.name,
          updatedAt: new Date().toISOString(),
          messages: [...t.messages, {
            id: `SYS-${Date.now()}`,
            senderId: 'system',
            senderName: 'SISTEMA',
            senderRole: UserRole.ADMIN,
            content: `${user.name} iniciou o atendimento.`,
            timestamp: new Date().toISOString(),
            type: 'system' as const,
            read: true
          }]
        };
      }
      return t;
    });
    saveTickets(updated);
    setSelectedTicketId(ticketId);
  };

  const handleCloseTicket = () => {
    setIsActionMenuOpen(false);
    if (!selectedTicketId) return;
    setIsEvaluationModalOpen(true);
  };

  const confirmCloseTicket = (finalRating?: number) => {
    if (!selectedTicketId) return;

    const updated = tickets.map(t => {
      if (t.id === selectedTicketId) {
        return {
          ...t,
          status: 'FECHADO' as const,
          rating: finalRating,
          updatedAt: new Date().toISOString(),
          messages: [...t.messages, {
            id: `SYS-${Date.now()}`,
            senderId: 'system',
            senderName: 'SISTEMA',
            senderRole: user.role,
            content: `Atendimento encerrado por ${user.name}. ${finalRating ? `Avaliação: ${finalRating} estrelas.` : ''}`,
            timestamp: new Date().toISOString(),
            type: 'system' as const,
            read: true
          }]
        };
      }
      return t;
    });
    saveTickets(updated);
    setIsEvaluationModalOpen(false);
    setRating(0);
  };

  // Ticket atual baseado no ID selecionado ou busca automática
  const selectedTicket = tickets.find(t => t.id === selectedTicketId);
  const myPendingTicket = tickets.find(t => t.clientId === user.id && t.status === 'PENDENTE');
  const myActiveTicket = tickets.find(t => t.clientId === user.id && t.status === 'EM_ATENDIMENTO');
  const currentTicket = isAdmin ? selectedTicket : (selectedTicket || myActiveTicket || myPendingTicket);

  const sendMessage = () => {
    // Usamos o ID do currentTicket para garantir que estamos enviando para o ticket correto
    const targetId = currentTicket?.id;
    if (!newMessage.trim() || !targetId) return;

    const message: SupportMessage = {
      id: `MSG-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      read: false
    };

    const updated = tickets.map(t => {
      if (t.id === targetId) {
        return {
          ...t,
          updatedAt: new Date().toISOString(),
          unreadCountAdmin: isAdmin ? t.unreadCountAdmin : t.unreadCountAdmin + 1,
          unreadCountClient: isAdmin ? t.unreadCountClient + 1 : t.unreadCountClient,
          messages: [...t.messages, message]
        };
      }
      return t;
    });

    saveTickets(updated);
    setNewMessage('');
    setIsTyping(false);
  };

  const WaitingRoom = ({ ticket }: { ticket: SupportTicket }) => (
    <div className="flex-1 flex items-center justify-center p-6 lg:p-12 animate-in fade-in zoom-in duration-500">
      <div className="max-w-md w-full glass rounded-[3rem] border border-cyan-500/20 p-10 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/10 overflow-hidden">
          <div className="h-full bg-cyan-500 animate-progress-fast shadow-[0_0_10px_#00D4FF]"></div>
        </div>
        
        <div className="relative">
          <div className="w-24 h-24 bg-cyan-500/10 rounded-[2.5rem] flex items-center justify-center text-cyan-400 mx-auto animate-pulse">
            <Clock size={48} />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-black border-4 border-[#0A0A14] animate-bounce">
            #3
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black">Aguardando Atendimento</h2>
          <p className="text-gray-400 text-sm">Sua solicitação foi recebida e está na fila prioritária.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Tempo Est.</p>
            <p className="text-xl font-black text-cyan-400">3-5m</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Atendentes</p>
            <p className="text-xl font-black text-purple-400">2 ON</p>
          </div>
        </div>

        <div className="p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10 flex items-center gap-3">
          <Loader2 className="text-cyan-400 animate-spin" size={18} />
          <p className="text-[10px] text-gray-400 text-left font-medium">Um especialista visualizou seu chamado e deve entrar em breve.</p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest flex items-center justify-center gap-2">
            <Shield size={12} className="text-cyan-500" /> Atendimento Seguro 24h
          </div>
          <button onClick={() => confirmCloseTicket()} className="text-xs text-red-500 font-bold hover:underline">Cancelar Solicitação</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-10rem)] min-h-[600px] flex rounded-[2.5rem] overflow-hidden border border-gray-800 bg-[#0A0A14] shadow-2xl relative">
      
      {(isAdmin || (!currentTicket && !isNewTicketModalOpen)) && (
        <div className="w-full lg:w-96 border-r border-gray-800 flex flex-col bg-[#121220]">
          <div className="p-6 border-b border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Suporte</h3>
              {!isAdmin && (
                <button 
                  onClick={() => setIsNewTicketModalOpen(true)}
                  className="p-2 rounded-xl bg-cyan-500 text-white shadow-lg hover:scale-105 transition-all"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Buscar chamados..."
                className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isAdmin && (
              <div className="p-4 bg-cyan-500/5 border-b border-cyan-500/10">
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-3">Fila de Espera ({tickets.filter(t => t.status === 'PENDENTE').length})</p>
                <div className="space-y-2">
                  {tickets.filter(t => t.status === 'PENDENTE').map(t => (
                    <div key={t.id} className="p-4 bg-gray-900 rounded-2xl border border-white/5 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono text-cyan-400">{t.id}</span>
                        <span className="text-[9px] text-gray-500 flex items-center gap-1"><Clock size={8}/> {new Date(t.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                      </div>
                      <h4 className="text-xs font-bold truncate">{t.subject}</h4>
                      <button 
                        onClick={() => handleStartService(t.id)}
                        className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Zap size={12} /> Iniciar Agora
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="divide-y divide-gray-800/50">
              <p className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Meus Atendimentos</p>
              {tickets.filter(t => t.status !== 'PENDENTE' && (isAdmin ? t.assignedTo === user.id : t.clientId === user.id)).map(t => (
                <button 
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`w-full p-5 text-left transition-all hover:bg-white/5 relative ${selectedTicketId === t.id ? 'bg-cyan-500/5 border-l-4 border-cyan-500' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono font-black text-cyan-400 opacity-60 uppercase">{t.id}</span>
                    <span className="text-[10px] text-gray-500">Hoje</span>
                  </div>
                  <h4 className="text-sm font-bold mb-1 truncate">{t.subject}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                      t.status === 'EM_ATENDIMENTO' ? 'bg-green-500/10 text-green-500' : 'bg-gray-800 text-gray-500'
                    }`}>
                      {t.status.replace('_', ' ')}
                    </span>
                    {(isAdmin ? t.unreadCountAdmin : t.unreadCountClient) > 0 && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col bg-gray-950/20">
        {!isAdmin && currentTicket?.status === 'PENDENTE' ? (
          <WaitingRoom ticket={currentTicket} />
        ) : currentTicket ? (
          <>
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#121220]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
                  {isAdmin ? currentTicket.clientName.charAt(0) : (currentTicket.assignedName?.charAt(0) || 'S')}
                </div>
                <div>
                  <h4 className="text-sm font-bold">{isAdmin ? currentTicket.clientName : (currentTicket.assignedName || 'Suporte ISA')}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${currentTicket.status === 'EM_ATENDIMENTO' ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      {currentTicket.status === 'EM_ATENDIMENTO' ? 'Em Atendimento' : 'Encerrado'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="hidden sm:block text-right pr-4 border-r border-gray-800">
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Ticket ID</p>
                   <p className="text-xs font-mono text-cyan-400">{currentTicket.id}</p>
                 </div>
                 <div className="relative" ref={actionMenuRef}>
                    <button 
                      onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                      className="p-2 text-gray-500 hover:text-white transition-colors"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {isActionMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#1a1a2e] border border-white/10 shadow-2xl z-50 overflow-hidden animate-in zoom-in duration-200">
                         <button 
                            onClick={handleCloseTicket}
                            disabled={currentTicket.status === 'FECHADO'}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-left transition-all ${
                              currentTicket.status === 'FECHADO' ? 'text-gray-600 cursor-not-allowed' : 'text-red-400 hover:bg-red-500/10'
                            }`}
                          >
                           <LogOut size={16} /> Encerrar Atendimento
                         </button>
                         <div className="px-4 py-2 border-t border-white/5 bg-gray-900/30">
                           <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Opções de Chamado</p>
                         </div>
                      </div>
                    )}
                 </div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-chat-grid">
               {currentTicket.messages.map((msg, i) => {
                 const isMine = msg.senderId === user.id;
                 if (msg.type === 'system') {
                   return (
                     <div key={msg.id} className="flex justify-center">
                        <div className="px-4 py-1.5 bg-gray-900/50 border border-white/5 rounded-full text-[9px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-2">
                          <CheckCircle2 size={10} className="text-green-500" /> {msg.content}
                        </div>
                     </div>
                   );
                 }
                 return (
                   <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                     <div className={`max-w-[75%] space-y-1`}>
                       {!isMine && <p className="text-[10px] font-bold text-gray-500 ml-2 mb-1">{msg.senderName}</p>}
                       <div className={`p-4 rounded-3xl text-sm shadow-xl relative ${
                         isMine 
                         ? 'bg-cyan-600 text-white rounded-tr-none' 
                         : 'bg-gray-800 text-gray-100 rounded-tl-none border border-white/5'
                       }`}>
                         {msg.content}
                         {isMine && (
                           <div className="absolute -bottom-5 right-1 flex items-center gap-1">
                             <span className="text-[9px] text-gray-600">Visto</span>
                             <CheckCircle2 size={10} className="text-cyan-400" />
                           </div>
                         )}
                       </div>
                       <p className={`text-[9px] text-gray-600 pt-1 ${isMine ? 'text-right mr-2' : 'ml-2'}`}>
                         {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                       </p>
                     </div>
                   </div>
                 );
               })}
            </div>

            <div className="p-6 bg-[#121220] border-t border-gray-800">
               {currentTicket.status === 'FECHADO' ? (
                 <div className="flex items-center justify-center p-4 bg-gray-900/50 rounded-2xl border border-white/5 text-xs text-gray-500 font-bold uppercase tracking-widest">
                   Atendimento arquivado e encerrado.
                 </div>
               ) : (
                 <>
                   {isTyping && <div className="text-[10px] text-gray-500 italic mb-2 ml-4">Digitando...</div>}
                   <div className="flex items-center gap-4 bg-gray-950 border border-gray-800 rounded-[2rem] p-2 pl-6 shadow-inner">
                      <button className="text-gray-500 hover:text-cyan-400 transition-colors"><Smile size={20} /></button>
                      <button className="text-gray-500 hover:text-cyan-400 transition-colors"><Paperclip size={20} /></button>
                      <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          setIsTyping(e.target.value.length > 0);
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Escreva sua mensagem..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
                      />
                      <button 
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className={`p-3.5 rounded-2xl transition-all ${newMessage.trim() ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-gray-800 text-gray-600'}`}
                      >
                        <Send size={18} />
                      </button>
                   </div>
                 </>
               )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-20">
            <EmptyState 
              icon={MessageCircle} 
              title="Central de Suporte ISA" 
              description="Acesse nosso suporte 24h especializado para resolver qualquer dúvida técnica."
              actionLabel={!isAdmin ? "Novo Atendimento" : "Aguardando Chamados"}
              onAction={() => !isAdmin && setIsNewTicketModalOpen(true)}
            />
          </div>
        )}
      </div>

      {isEvaluationModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-[#121220] border border-white/10 rounded-[3rem] p-10 text-center space-y-8 animate-in zoom-in duration-300 shadow-2xl">
            <div className="w-20 h-20 bg-cyan-500/10 rounded-[2rem] flex items-center justify-center text-cyan-400 mx-auto">
              <Bot size={40} className="animate-float" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black">{isAdmin ? 'Finalizar Atendimento?' : 'Como foi seu atendimento?'}</h3>
              <p className="text-gray-500 text-sm">
                {isAdmin ? 'Você está encerrando este chamado. Deseja confirmar?' : 'Sua opinião nos ajuda a evoluir a plataforma ISA.'}
              </p>
            </div>
            
            {!isAdmin ? (
               <div className="flex justify-center gap-3">
               {[1, 2, 3, 4, 5].map((star) => (
                 <button 
                   key={star}
                   onClick={() => setRating(star)}
                   onMouseEnter={() => setRating(star)}
                   className="transition-transform hover:scale-125"
                 >
                   <Star 
                     size={36} 
                     className={`${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`} 
                   />
                 </button>
               ))}
             </div>
            ) : (
              <div className="p-4 bg-gray-900 rounded-2xl border border-white/5 text-xs text-gray-400 italic">
                O cliente receberá uma notificação de encerramento e poderá avaliar sua performance.
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => confirmCloseTicket(rating > 0 ? rating : undefined)}
                disabled={!isAdmin && rating === 0}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl ${
                  isAdmin || rating > 0 ? 'bg-cyan-500 text-white shadow-cyan-500/20' : 'bg-gray-800 text-gray-600'
                }`}
              >
                {isAdmin ? 'Confirmar Encerramento' : 'Confirmar e Avaliar'}
              </button>
              <button onClick={() => setIsEvaluationModalOpen(false)} className="text-[10px] text-gray-500 uppercase font-black tracking-widest hover:text-white transition-colors">Voltar</button>
            </div>
          </div>
        </div>
      )}

      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#121220] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gray-900/50">
              <h3 className="text-xl font-bold">Solicitar Atendimento</h3>
              <button onClick={() => setIsNewTicketModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={createTicket} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Assunto Curto</label>
                <input 
                  type="text" 
                  required
                  value={newTicketData.subject}
                  onChange={(e) => setNewTicketData({...newTicketData, subject: e.target.value})}
                  className="w-full bg-gray-950 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm"
                  placeholder="Ex: Erro ao conectar WhatsApp"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Prioridade</label>
                  <select 
                    value={newTicketData.priority}
                    onChange={(e) => setNewTicketData({...newTicketData, priority: e.target.value as any})}
                    className="w-full bg-gray-950 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none text-sm"
                  >
                    <option value="BAIXA">Baixa</option>
                    <option value="NORMAL">Normal</option>
                    <option value="ALTA">Alta</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Categoria</label>
                  <select className="w-full bg-gray-950 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none text-sm">
                    <option>WhatsApp Bot</option>
                    <option>Financeiro</option>
                    <option>Outros</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Descrição do Problema</label>
                <textarea 
                  required
                  rows={4}
                  value={newTicketData.description}
                  onChange={(e) => setNewTicketData({...newTicketData, description: e.target.value})}
                  className="w-full bg-gray-950 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm resize-none"
                  placeholder="Detalhe o ocorrido..."
                />
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-3"
              >
                <Send size={18} /> Iniciar Fila de Espera
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes progress-fast {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress-fast {
          animation: progress-fast 2s linear infinite;
        }
        .bg-chat-grid {
          background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default Support;
