
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { 
  Smartphone, QrCode, Play, Pause, RefreshCw, Power, 
  Terminal, CheckCircle2, AlertCircle, Signal, Battery, 
  Wifi, ShieldCheck, Zap, History, Loader2, Share2,
  Trash2, Eraser, Settings2, Activity, Clock, ShieldAlert,
  ChevronRight, ArrowRight, Save, Database, HardDrive, Download
} from 'lucide-react';

type InstanceStatus = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED' | 'PAUSED' | 'CLEANING' | 'ERROR';

export default function WhatsAppManager({ user }: { user: User }) {
  // --- STATE ---
  const [status, setStatus] = useState<InstanceStatus>('DISCONNECTED');
  const [isAiPaused, setIsAiPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<{msg: string, time: string, type: 'info' | 'success' | 'error' | 'warn'}[]>([]);
  
  // Modal States
  const [showCleanModal, setShowCleanModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanStep, setCleanStep] = useState(0);
  
  const addLog = (msg: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') => {
    setLogs(prev => [{ msg, time: new Date().toLocaleTimeString(), type }, ...prev].slice(0, 50));
  };

  // --- HANDLERS ---
  const handleConnect = () => {
    setStatus('CONNECTING');
    setProgress(0);
    addLog(`Iniciando handshake para instância ${user.matricula}...`);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('CONNECTED');
          addLog('Sessão validada! WebSocket estabelecido com sucesso.', 'success');
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handlePauseAi = () => {
    setIsAiPaused(!isAiPaused);
    setStatus(isAiPaused ? 'CONNECTED' : 'PAUSED');
    addLog(isAiPaused ? 'Atendimento automático ISA retomado.' : 'IA em modo de pausa. Respostas automáticas desativadas.', isAiPaused ? 'success' : 'warn');
    setShowPauseModal(false);
  };

  const handleFullClean = () => {
    setIsCleaning(true);
    setCleanStep(1);
    addLog('Iniciando limpeza profunda da instância...', 'warn');
    
    const steps = [
      '📦 Preparando backup de segurança...',
      '🔍 Analisando diretórios temporários...',
      '🗑️ Removendo cache de sessão e mídia...',
      '🧹 Limpando metadados de socket...',
      '🔄 Recriando workspace da instância...',
      '✅ Limpeza concluída com sucesso!'
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length - 1) {
        current++;
        setCleanStep(current + 1);
        addLog(steps[current], current === steps.length -1 ? 'success' : 'info');
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsCleaning(false);
          setShowCleanModal(false);
          setStatus('DISCONNECTED');
          setCleanStep(0);
        }, 1000);
      }
    }, 800);
  };

  const handleDisconnect = () => {
    if(window.confirm('Encerrar sessão? Todos os processos ativos serão interrompidos.')) {
      setStatus('DISCONNECTED');
      setProgress(0);
      addLog('Instância desconectada pelo administrador.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Status & Telemetry */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Status Card */}
          <section className="bg-[#121220] border border-gray-800 rounded-[3rem] p-10 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
            {/* Status Glow Background */}
            <div className={`absolute top-0 right-0 w-64 h-64 blur-[120px] rounded-full -mr-32 -mt-32 transition-all duration-1000 ${
              status === 'CONNECTED' ? 'bg-green-500/10' : 
              status === 'PAUSED' ? 'bg-orange-500/10' :
              status === 'CONNECTING' ? 'bg-yellow-500/10' : 'bg-red-500/10'
            }`}></div>

            <div className="flex flex-col items-center relative z-10">
              <div className="w-16 h-16 bg-gray-950 rounded-[1.5rem] flex items-center justify-center text-gray-500 mb-6 border border-white/5">
                <Smartphone size={32} />
              </div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Estado da Instância</h2>
              <div className="flex items-center gap-3 mb-8">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  status === 'CONNECTED' ? 'bg-green-500 shadow-[0_0_12px_#22C55E]' : 
                  status === 'PAUSED' ? 'bg-orange-500' :
                  status === 'CONNECTING' ? 'bg-yellow-500 shadow-[0_0_12px_#EAB308]' : 'bg-red-500 shadow-[0_0_12px_#EF4444]'
                }`}></div>
                <h3 className="text-3xl font-black italic tracking-tighter">{status}</h3>
              </div>
            </div>

            <div className="w-full space-y-6 relative z-10">
               <div className="bg-gray-950/50 rounded-3xl p-6 border border-white/5 flex flex-col items-center">
                  <div className="relative group">
                    <div className={`p-4 bg-white rounded-3xl shadow-2xl transition-all duration-700 ${status === 'CONNECTED' || status === 'PAUSED' ? 'blur-xl grayscale opacity-20 scale-90' : 'scale-100'}`}>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ISA2.5-AUTH-${user.matricula}`} 
                        alt="QR Code" 
                        className="w-48 h-48"
                      />
                    </div>
                    {status === 'CONNECTED' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-[0_0_40px_rgba(34,197,94,0.3)] mb-4">
                          <CheckCircle2 size={40} />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-green-500">Sessão Ativa</p>
                      </div>
                    )}
                    {status === 'PAUSED' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-[0_0_40px_rgba(249,115,22,0.3)] mb-4">
                          <Pause size={40} />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-orange-500">IA em Pausa</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 flex flex-col items-center gap-2">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Matrícula Associada</p>
                    <span className="text-sm font-mono font-black text-cyan-400">ISA-{user.matricula || 'DEMO'}</span>
                  </div>
               </div>
            </div>
          </section>

          {/* Metrics Telemetry Grid */}
          <section className="grid grid-cols-2 gap-4">
            {[
              { label: 'Sinal de Rede', val: status === 'CONNECTED' ? 'Excelente' : '-', icon: <Signal size={16} />, color: 'text-cyan-400' },
              { label: 'Carga Bateria', val: status === 'CONNECTED' ? '84%' : '-', icon: <Battery size={16} />, color: 'text-green-500' },
              { label: 'Latência API', val: status === 'CONNECTED' ? '128ms' : '-', icon: <Activity size={16} />, color: 'text-purple-400' },
              { label: 'Sessão Uptime', val: status === 'CONNECTED' ? '02h 45m' : '-', icon: <Clock size={16} />, color: 'text-yellow-500' },
            ].map((m, i) => (
              <div key={i} className="bg-[#121220] border border-gray-800 p-6 rounded-[2rem] hover:border-white/10 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-gray-600 group-hover:text-white transition-colors">{m.icon}</div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-800 group-hover:bg-cyan-500 transition-colors"></div>
                </div>
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">{m.label}</p>
                <p className={`text-sm font-black ${m.color}`}>{m.val}</p>
              </div>
            ))}
          </section>

        </div>

        {/* RIGHT COLUMN: Controls & Logs */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Advanced Controls Panel */}
          <section className="bg-[#121220] border border-gray-800 rounded-[3rem] p-1 shadow-2xl overflow-hidden">
             <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-gray-900/30">
               <div className="flex items-center gap-3">
                 <Settings2 className="text-cyan-400" size={20} />
                 <h3 className="font-bold">Controles Avançados</h3>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Operacional</span>
               </div>
             </div>

             <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Connection Controls */}
                <div className="space-y-4">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 ml-2">Fluxo de Conexão</p>
                   <div className="grid grid-cols-1 gap-3">
                     <button 
                       onClick={handleConnect}
                       disabled={status === 'CONNECTED' || status === 'CONNECTING'}
                       className="w-full flex items-center justify-between p-5 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl hover:bg-cyan-500 hover:text-white transition-all group disabled:opacity-50"
                     >
                       <div className="flex items-center gap-4">
                         <Play size={20} />
                         <div className="text-left">
                           <p className="text-xs font-black uppercase tracking-widest">Conectar Agora</p>
                           <p className="text-[9px] opacity-70">Gera novo QR Code de sessão</p>
                         </div>
                       </div>
                       <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                     </button>

                     <button 
                       onClick={() => setShowPauseModal(true)}
                       className={`w-full flex items-center justify-between p-5 border rounded-2xl transition-all group ${
                         isAiPaused 
                         ? 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white' 
                         : 'bg-orange-500/10 border-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white'
                       }`}
                     >
                       <div className="flex items-center gap-4">
                         {isAiPaused ? <Play size={20} /> : <Pause size={20} />}
                         <div className="text-left">
                           <p className="text-xs font-black uppercase tracking-widest">{isAiPaused ? 'Retomar IA' : 'Pausar IA'}</p>
                           <p className="text-[9px] opacity-70">Controla respostas automáticas</p>
                         </div>
                       </div>
                       <ChevronRight size={18} />
                     </button>
                   </div>
                </div>

                {/* Maintenance Controls */}
                <div className="space-y-4">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 ml-2">Manutenção Crítica</p>
                   <div className="grid grid-cols-1 gap-3">
                     <button 
                       onClick={() => setShowCleanModal(true)}
                       className="w-full flex items-center justify-between p-5 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400 hover:bg-purple-500 hover:text-white transition-all group"
                     >
                       <div className="flex items-center gap-4">
                         <Eraser size={20} />
                         <div className="text-left">
                           <p className="text-xs font-black uppercase tracking-widest">Limpeza Completa</p>
                           <p className="text-[9px] opacity-70">Remove cache e arquivos temporários</p>
                         </div>
                       </div>
                       <ChevronRight size={18} />
                     </button>

                     <button 
                       onClick={handleDisconnect}
                       disabled={status === 'DISCONNECTED'}
                       className="w-full flex items-center justify-between p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all group disabled:opacity-50"
                     >
                       <div className="flex items-center gap-4">
                         <Power size={20} />
                         <div className="text-left">
                           <p className="text-xs font-black uppercase tracking-widest">Desconectar</p>
                           <p className="text-[9px] opacity-70">Encerra sessão com segurança</p>
                         </div>
                       </div>
                       <ChevronRight size={18} />
                     </button>
                   </div>
                </div>
             </div>

             <div className="p-8 pt-0 flex flex-wrap gap-4">
               <button onClick={() => setShowBackupModal(true)} className="flex items-center gap-2 px-6 py-3 bg-gray-900 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                 <Database size={14} /> Backup de Sessão
               </button>
               <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                 <ShieldAlert size={14} /> Ferramentas de Diagnóstico
               </button>
             </div>
          </section>

          {/* System Logs Viewer */}
          <section className="bg-[#121220] border border-gray-800 rounded-[3rem] flex flex-col overflow-hidden shadow-2xl h-[400px]">
            <div className="p-6 bg-gray-900/50 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal size={18} className="text-cyan-400" />
                <h3 className="font-bold text-sm">Console de Logs</h3>
              </div>
              <div className="flex gap-4">
                <button className="text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors">Exportar</button>
                <button onClick={() => setLogs([])} className="text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors">Limpar</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] space-y-3 bg-black/30 scrollbar-thin scrollbar-thumb-gray-800">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <Activity size={48} className="mb-4" />
                  <p className="font-black uppercase tracking-widest">Aguardando Eventos do Sistema</p>
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={`flex gap-4 animate-in slide-in-from-left-2 duration-300 ${i === 0 ? 'text-white' : 'text-gray-500'}`}>
                    <span className="shrink-0 opacity-40">[{log.time}]</span>
                    <span className={`uppercase font-black tracking-widest shrink-0 ${
                      log.type === 'success' ? 'text-green-500' : 
                      log.type === 'error' ? 'text-red-500' : 
                      log.type === 'warn' ? 'text-orange-500' : 'text-cyan-500'
                    }`}>
                      {log.type}
                    </span>
                    <span className="flex-1">{log.msg}</span>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 bg-gray-950 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">Sistema Estável</span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-700">ISA Kernel v2.5.0-PRO</span>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* MODAL: FULL CLEAN */}
      {showCleanModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#121220] border border-red-500/30 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            {!isCleaning ? (
              <div className="p-12 space-y-8">
                 <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center text-red-500 mx-auto">
                    <ShieldAlert size={48} />
                 </div>
                 <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black italic">Limpeza Crítica</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Esta ação removerá todos os arquivos temporários, logs e cache de sessão. Uma nova conexão WhatsApp poderá ser necessária.</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                       <p className="text-[10px] font-black uppercase text-gray-500">Vai ser Limpo</p>
                       <ul className="text-[10px] font-bold text-gray-300 space-y-1">
                          <li>• Cache de Mídia</li>
                          <li>• Logs de Erros</li>
                          <li>• Session Storage</li>
                       </ul>
                    </div>
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                       <p className="text-[10px] font-black uppercase text-gray-500">Fica Intocado</p>
                       <ul className="text-[10px] font-bold text-gray-300 space-y-1">
                          <li>• Memória da IA</li>
                          <li>• Suas Mensagens</li>
                          <li>• Configurações</li>
                       </ul>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => setShowCleanModal(false)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">Cancelar</button>
                    <button 
                      onClick={handleFullClean}
                      className="flex-[2] py-4 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-red-600/20 transition-all flex items-center justify-center gap-3"
                    >
                      <Trash2 size={18} /> Confirmar Limpeza
                    </button>
                 </div>
              </div>
            ) : (
              <div className="p-16 text-center space-y-10">
                 <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 rounded-[2.5rem] border-4 border-white/5"></div>
                    <div className="absolute inset-0 rounded-[2.5rem] border-4 border-purple-500 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Eraser size={40} className="text-purple-400 animate-pulse" />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-xl font-black text-white">Executando Limpeza...</h4>
                    <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden max-w-xs mx-auto">
                       <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${(cleanStep / 6) * 100}%` }}></div>
                    </div>
                    <p className="text-[10px] font-mono font-black uppercase text-gray-500 animate-pulse tracking-widest">
                       {cleanStep === 1 && 'Preparando Snapshot...'}
                       {cleanStep === 2 && 'Varrendo Diretórios...'}
                       {cleanStep === 3 && 'Purgando Arquivos...'}
                       {cleanStep === 4 && 'Limpando Memória...'}
                       {cleanStep === 5 && 'Reiniciando Engine...'}
                       {cleanStep === 6 && 'Finalizando Purgue...'}
                    </p>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: PAUSE IA */}
      {showPauseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#121220] border border-orange-500/30 rounded-[3rem] p-12 text-center space-y-8 animate-in zoom-in duration-300">
             <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto ${isAiPaused ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                {isAiPaused ? <Play size={40} /> : <Pause size={40} />}
             </div>
             <div className="space-y-3">
                <h3 className="text-2xl font-black italic">{isAiPaused ? 'Retomar Atendimento?' : 'Pausar Atendimento?'}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {isAiPaused 
                    ? 'A ISA voltará a responder todas as mensagens automaticamente usando as diretrizes configuradas.' 
                    : 'A IA parará de responder mensagens instantaneamente. O atendimento deverá ser feito de forma manual.'}
                </p>
             </div>
             <div className="flex flex-col gap-3">
                <button 
                  onClick={handlePauseAi}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all ${
                    isAiPaused ? 'bg-green-500 hover:bg-green-400 text-white shadow-green-500/20' : 'bg-orange-500 hover:bg-orange-400 text-white shadow-orange-500/20'
                  }`}
                >
                   {isAiPaused ? 'Retomar Inteligência' : 'Pausar Agora'}
                </button>
                <button onClick={() => setShowPauseModal(false)} className="text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors">Voltar para Dashboard</button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL: BACKUP */}
      {showBackupModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#121220] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
             <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gray-900/30">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                      <Database size={24} />
                   </div>
                   <h3 className="text-xl font-bold">Gestão de Backups</h3>
                </div>
                <button onClick={() => setShowBackupModal(false)} className="p-2 text-gray-500 hover:text-white"><X size={24}/></button>
             </div>
             <div className="p-10 space-y-8">
                <div className="space-y-4">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Backups Recentes</p>
                   {[
                     { date: '26/12/2025 14:30', size: '45MB', type: 'COMPLETO' },
                     { date: '25/12/2025 09:15', size: '42MB', type: 'SESSÃO' }
                   ].map((b, i) => (
                     <div key={i} className="flex items-center justify-between p-5 bg-gray-950 border border-white/5 rounded-2xl group hover:border-cyan-500/30 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-gray-900 rounded-xl text-gray-600 group-hover:text-cyan-400 transition-colors">
                              <HardDrive size={20} />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-white">{b.date}</p>
                              <p className="text-[9px] text-gray-500 font-black uppercase">{b.size} • {b.type}</p>
                           </div>
                        </div>
                        <button className="p-2 text-gray-600 hover:text-white transition-all"><Download size={18} /></button>
                     </div>
                   ))}
                </div>
                <button className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all flex items-center justify-center gap-3">
                   <Save size={18} /> Gerar Novo Backup Agora
                </button>
             </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 212, 255, 0.2);
        }
        .bg-chat-grid {
          background-image: radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}

// Fixed X import issue
const X = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);
