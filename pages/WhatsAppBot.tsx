
import React, { useState } from 'react';
import { QrCode, Play, Pause, RefreshCw, Power, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';

const WhatsAppBot: React.FC = () => {
  const [status, setStatus] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('DISCONNECTED');
  const [logs, setLogs] = useState<{msg: string, time: string, type: 'info' | 'success' | 'error'}[]>([
    { msg: 'Iniciando módulo de conexão...', time: '14:30:05', type: 'info' },
    { msg: 'Aguardando QR Code ser escaneado', time: '14:30:10', type: 'info' },
  ]);

  const handleConnect = () => {
    setStatus('CONNECTING');
    const newLog = { msg: 'Tentando conectar ao servidor WhatsApp...', time: new Date().toLocaleTimeString(), type: 'info' as const };
    setLogs(prev => [newLog, ...prev]);

    setTimeout(() => {
      setStatus('CONNECTED');
      const successLog = { msg: 'Conexão estabelecida com sucesso!', time: new Date().toLocaleTimeString(), type: 'success' as const };
      setLogs(prev => [successLog, ...prev]);
    }, 3000);
  };

  const handleDisconnect = () => {
    setStatus('DISCONNECTED');
    const disconnectLog = { msg: 'Desconectado manualmente pelo usuário.', time: new Date().toLocaleTimeString(), type: 'error' as const };
    setLogs(prev => [disconnectLog, ...prev]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* QR Code Section */}
        <div className="flex-1 space-y-6">
          <div className="bg-[#121220] border border-gray-800 rounded-3xl p-8 flex flex-col items-center text-center">
            <h3 className="text-xl font-bold mb-2">Conectar Instância</h3>
            <p className="text-gray-500 text-sm mb-10">Escaneie o QR Code abaixo com seu WhatsApp para ativar o bot.</p>
            
            <div className="relative group">
              <div className={`p-4 bg-white rounded-3xl shadow-2xl transition-all duration-500 ${status === 'CONNECTED' ? 'blur-md grayscale opacity-50 scale-90' : 'scale-100'}`}>
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ISA2.5-FUTURISTIC-AI" 
                  alt="QR Code" 
                  className="w-48 h-48 lg:w-64 lg:h-64"
                />
              </div>
              
              {status === 'CONNECTED' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(34,197,94,0.5)] mb-4">
                    <CheckCircle2 size={48} />
                  </div>
                  <p className="text-green-500 font-black text-xl">INSTÂNCIA ATIVA</p>
                </div>
              )}

              {status === 'CONNECTING' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {status === 'DISCONNECTED' ? (
                <button 
                  onClick={handleConnect}
                  className="flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-2xl transition-all shadow-lg"
                >
                  <Play size={20} /> Conectar Agora
                </button>
              ) : (
                <>
                  <button className="flex items-center gap-2 px-6 py-4 bg-yellow-600/20 text-yellow-500 border border-yellow-600/30 hover:bg-yellow-600/30 font-bold rounded-2xl transition-all">
                    <Pause size={20} /> Pausar
                  </button>
                  <button className="flex items-center gap-2 px-6 py-4 bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600/30 font-bold rounded-2xl transition-all">
                    <RefreshCw size={20} /> Reiniciar
                  </button>
                  <button 
                    onClick={handleDisconnect}
                    className="flex items-center gap-2 px-6 py-4 bg-red-600/20 text-red-500 border border-red-600/30 hover:bg-red-600/30 font-bold rounded-2xl transition-all"
                  >
                    <Power size={20} /> Desconectar
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Device Info */}
          <div className="bg-[#121220] border border-gray-800 rounded-3xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <p className={`text-sm font-bold ${status === 'CONNECTED' ? 'text-green-500' : 'text-red-500'}`}>
                {status === 'CONNECTED' ? 'Online' : 'Offline'}
              </p>
            </div>
            <div className="text-center p-4 border-l border-gray-800">
              <p className="text-xs text-gray-500 mb-1">Telefone</p>
              <p className="text-sm font-bold">{status === 'CONNECTED' ? '+55 (11) 99888-7766' : '-'}</p>
            </div>
            <div className="text-center p-4 border-l border-gray-800">
              <p className="text-xs text-gray-500 mb-1">Mensagens</p>
              <p className="text-sm font-bold">{status === 'CONNECTED' ? '1.284' : '0'}</p>
            </div>
            <div className="text-center p-4 border-l border-gray-800">
              <p className="text-xs text-gray-500 mb-1">Latência</p>
              <p className="text-sm font-bold">{status === 'CONNECTED' ? '45ms' : '-'}</p>
            </div>
          </div>
        </div>

        {/* Logs Section */}
        <div className="w-full lg:w-96 flex flex-col">
          <div className="bg-[#121220] border border-gray-800 rounded-3xl flex-1 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Terminal size={18} />
                <span>Logs do Console</span>
              </div>
              <button 
                onClick={() => setLogs([])}
                className="text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-widest"
              >
                Limpar
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-700 opacity-50">
                  <Terminal size={40} className="mb-2" />
                  <p>Aguardando atividade...</p>
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="flex gap-2 animate-in slide-in-from-right-2 duration-300">
                    <span className="text-gray-600">[{log.time}]</span>
                    <span className={
                      log.type === 'success' ? 'text-green-400' : 
                      log.type === 'error' ? 'text-red-400' : 'text-cyan-400'
                    }>
                      {log.msg}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 bg-black/40 border-t border-gray-800">
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Sistema operacional estável.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WhatsAppBot;
