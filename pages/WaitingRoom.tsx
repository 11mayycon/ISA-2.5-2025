
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, Copy, Printer, ArrowLeft, Bot } from 'lucide-react';

const WaitingRoom: React.FC = () => {
  const [request, setRequest] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('isa_current_request');
    if (!data) {
      navigate('/login');
    } else {
      setRequest(JSON.parse(data));
    }
  }, [navigate]);

  const copyMatricula = () => {
    navigator.clipboard.writeText(request.matricula);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!request) return null;

  return (
    <div className="min-h-screen bg-[#0A0A14] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-20"></div>
      
      <div className="w-full max-w-xl relative z-10 animate-in zoom-in duration-500">
        <div className="glass rounded-[4rem] border-white/10 p-12 text-center shadow-2xl space-y-8">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-cyan-500/10 rounded-[2.5rem] flex items-center justify-center text-cyan-400 animate-pulse">
              <Clock size={48} />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black">Solicitação em Análise</h2>
            <p className="text-gray-400">Tudo pronto! Sua conta está sendo verificada pela nossa equipe administrativa.</p>
          </div>

          <div className="p-8 bg-gray-950/50 border border-white/5 rounded-3xl space-y-6">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Sua Matrícula Exclusiva</p>
            <div className="flex flex-col items-center gap-4">
              <span className="text-5xl lg:text-6xl font-black text-cyan-400 font-mono tracking-widest">{request.matricula}</span>
              <button 
                onClick={copyMatricula}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                {copied ? <><CheckCircle2 size={16} /> Copiado</> : <><Copy size={16} /> Copiar Matrícula</>}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-4 glass rounded-2xl border-white/5">
              <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Status Atual</p>
              <div className="flex items-center gap-2 text-yellow-500">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping"></div>
                <span className="text-xs font-bold uppercase">Pendente</span>
              </div>
            </div>
            <div className="p-4 glass rounded-2xl border-white/5">
              <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Expectativa</p>
              <span className="text-xs font-bold text-gray-300">Até 24h úteis</span>
            </div>
          </div>

          <div className="pt-8 space-y-4">
            <button 
              onClick={() => navigate('/login')}
              className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Voltar ao Login
            </button>
            <p className="text-[10px] text-gray-600 italic">Guarde sua matrícula para realizar o login assim que aprovado.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
