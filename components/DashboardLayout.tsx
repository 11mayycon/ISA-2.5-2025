
import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User as UserIcon, LogOut, Sun, Moon, MessageSquare, Users, Settings as SettingsIcon, Fingerprint, Info, AlertTriangle, Zap, Wrench, Calendar, CheckCircle, LifeBuoy } from 'lucide-react';
import { User, UserRole, Notice, SupportTicket } from '../types';
import { MENU_ITEMS } from '../constants';
import { useNotifications } from '../context/NotificationContext';

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const notifRef = useRef<HTMLDivElement>(null);
  
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

  // Filtra itens de menu por role
  const filteredMenuItems = MENU_ITEMS.filter(item => item.roles.includes(user.role));
  const activeTab = location.pathname.split('/')[1] || 'dashboard';

  // Filtra notificações do sistema por role do usuário ATUAL
  const filteredNotifications = notifications.filter(n => n.targetRoles.includes(user.role));

  useEffect(() => {
    const loadData = () => {
      const storedNotices = JSON.parse(localStorage.getItem('isa_notices') || '[]');
      const storedTickets = JSON.parse(localStorage.getItem('isa_tickets') || '[]');
      setNotices(storedNotices);
      setSupportTickets(storedTickets);
    };
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const unreadNotices = notices.filter(n => !n.readBy.includes(user.id));
  
  // Calcula mensagens de suporte não lidas
  const unreadSupportCount = supportTickets.reduce((acc, t) => {
    if (user.role === UserRole.CLIENTE) {
      return acc + (t.clientId === user.id ? t.unreadCountClient : 0);
    } else {
      return acc + (t.status === 'PENDENTE' ? 1 : t.unreadCountAdmin);
    }
  }, 0);

  const totalUnreadCount = unreadCount(user.role) + unreadNotices.length + unreadSupportCount;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenNotice = (notice: Notice) => {
    setViewingNotice(notice);
    setNotifOpen(false);
    
    // Marca o aviso como lido pelo usuário atual no localStorage
    if (!notice.readBy.includes(user.id)) {
      const stored = JSON.parse(localStorage.getItem('isa_notices') || '[]');
      const updated = stored.map((n: Notice) => {
        if (n.id === notice.id) return { ...n, readBy: [...n.readBy, user.id] };
        return n;
      });
      localStorage.setItem('isa_notices', JSON.stringify(updated));
      setNotices(updated);
    }
  };

  const getNoticeIcon = (type: string) => {
    switch(type) {
      case 'URGENTE': return <AlertTriangle size={20} className="text-red-500" />;
      case 'IMPORTANTE': return <Zap size={20} className="text-yellow-500" />;
      case 'MANUTENCAO': return <Wrench size={20} className="text-purple-500" />;
      case 'ATUALIZACAO': return <CheckCircle size={20} className="text-green-500" />;
      default: return <Info size={20} className="text-cyan-500" />;
    }
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-[#0A0A14] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 ${isDark ? 'bg-[#121220]' : 'bg-white'} border-r ${isDark ? 'border-gray-800' : 'border-gray-200'} transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">ISA</div>
          <span className="text-xl font-bold tracking-tight">ISA 2.5</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const isSupport = item.id === 'support';
            const showBadge = isSupport && unreadSupportCount > 0;

            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(`/${item.id}`);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id 
                  ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner' 
                  : `${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={activeTab === item.id ? 'text-cyan-400' : ''}>{item.icon}</span>
                  {item.label}
                </div>
                {showBadge && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-lg shadow-red-500/40 animate-pulse">
                    {unreadSupportCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isDark ? 'text-red-400 hover:bg-red-400/10' : 'text-red-500 hover:bg-red-50'}`}
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`h-16 flex items-center justify-between px-4 lg:px-8 border-b ${isDark ? 'bg-[#121220] border-gray-800' : 'bg-white border-gray-200'} z-30`}>
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="hidden lg:flex items-center gap-4">
            <h2 className="text-lg font-semibold capitalize">{activeTab.replace('-', ' ')}</h2>
            {user.role === UserRole.CLIENTE && (
               <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                 <Fingerprint size={14} className="text-cyan-400" />
                 <span className="text-[10px] font-mono font-black text-cyan-400 tracking-widest uppercase">Matrícula: {user.matricula}</span>
               </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className={`p-2 rounded-full relative ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-all`}
              >
                <Bell size={20} />
                {totalUnreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white border-2 border-[#121220] animate-bounce">
                    {totalUnreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className={`absolute right-0 mt-4 w-80 lg:w-96 rounded-3xl border ${isDark ? 'bg-[#121220] border-gray-800 shadow-[0_10px_40px_rgba(0,0,0,0.5)]' : 'bg-white border-gray-200 shadow-2xl'} overflow-hidden animate-in slide-in-from-top-2 duration-300`}>
                  <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                    <h3 className="font-bold text-sm">Avisos e Notificações</h3>
                    <div className="flex gap-4">
                      <button onClick={() => markAllAsRead(user.role)} className="text-[10px] text-cyan-400 hover:underline uppercase font-bold tracking-widest">Lidas</button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto divide-y divide-gray-800/50">
                    
                    {/* Avisos Administrativos (Broadcasts) */}
                    {notices.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-4 hover:bg-white/5 transition-all cursor-pointer flex gap-3 ${!n.readBy.includes(user.id) ? 'bg-cyan-500/10' : ''}`}
                        onClick={() => handleOpenNotice(n)}
                      >
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                          {getNoticeIcon(n.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-bold">{n.title}</h4>
                            <span className="text-[10px] text-cyan-500 font-black uppercase tracking-widest">Aviso</span>
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-1">{n.content}</p>
                        </div>
                        {!n.readBy.includes(user.id) && <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 shrink-0 animate-pulse"></div>}
                      </div>
                    ))}

                    {/* Notificações do Sistema (Filtradas por Role) */}
                    {filteredNotifications.length === 0 && unreadNotices.length === 0 ? (
                      <div className="p-10 text-center">
                        <p className="text-gray-500 text-sm">Nenhuma nova notificação.</p>
                      </div>
                    ) : (
                      filteredNotifications.map((n) => (
                        <div 
                          key={n.id} 
                          className={`p-4 hover:bg-white/5 transition-all cursor-pointer flex gap-3 ${!n.read ? 'bg-cyan-500/5' : ''}`}
                          onClick={() => {
                            markAsRead(n.id); 
                            if(n.type === 'request' && (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_DONO)) navigate('/requests');
                            if(n.type === 'message') navigate('/support');
                          }}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            n.type === 'message' ? 'bg-purple-500/20 text-purple-400' :
                            n.type === 'request' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {n.type === 'message' ? <MessageSquare size={18} /> : 
                             n.type === 'request' ? <Users size={18} /> : <SettingsIcon size={18} />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="text-sm font-bold">{n.title}</h4>
                              <span className="text-[10px] text-gray-500">{n.time}</span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{n.message}</p>
                          </div>
                          {!n.read && <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 shrink-0"></div>}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 bg-gray-900/50 border-t border-gray-800 text-center">
                    <button onClick={() => navigate('/support')} className="text-[10px] text-gray-400 hover:text-white uppercase font-bold tracking-widest">Ver Todo Suporte</button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role.replace('_', ' ')}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center text-white">
                <UserIcon size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Pop-out Modal para Visualização de Aviso */}
      {viewingNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg glass border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className={`p-8 border-b border-white/5 flex justify-between items-center bg-gray-900/50`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5`}>
                  {getNoticeIcon(viewingNotice.type)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{viewingNotice.title}</h3>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    viewingNotice.type === 'URGENTE' ? 'text-red-500' : 'text-cyan-400'
                  }`}>{viewingNotice.type}</span>
                </div>
              </div>
              <button onClick={() => setViewingNotice(null)} className="p-2 text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="p-6 bg-gray-950/50 rounded-2xl border border-white/5 leading-relaxed text-gray-300 text-sm whitespace-pre-wrap">
                {viewingNotice.content}
              </div>
              
              <div className="flex items-center justify-between text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span className="text-xs">{new Date(viewingNotice.publishDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   <span className="text-[10px] font-bold uppercase tracking-widest">Publicação Oficial</span>
                </div>
              </div>

              <button 
                onClick={() => setViewingNotice(null)}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-black text-white shadow-lg hover:shadow-cyan-500/30 transition-all uppercase tracking-widest text-xs"
              >
                Concluir Leitura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
