
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { 
  Mail, Lock, ShieldCheck, Zap, ArrowRight, Fingerprint, 
  Bot, Terminal, Cpu, Shield, Globe, Info, Eye, EyeOff, 
  ChevronRight, ArrowLeft, Loader2, Sparkles, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { MOCK_REQUESTS } from '../constants';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

type Phase = 'boot' | 'reveal' | 'ready';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  
  // States
  const [phase, setPhase] = useState<Phase>('boot');
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [bootProgress, setBootProgress] = useState(0);
  const [selectedRole, setSelectedRole] = useState<'CLIENTE' | 'ADMIN' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [matricula, setMatricula] = useState(['', '', '', '', '', '']);
  const matriculaRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Boot Sequence Logic
  useEffect(() => {
    const logs = [
      "Initializing INOVAPRO Security Protocols...",
      "Connecting to Neural Network...",
      "Loading AI Modules (ISA 2.5 Core)...",
      "Validating Build #20251226...",
      "Establishing Secure Handshake...",
      "Rendering User Interface...",
      "System Ready."
    ];

    let currentLogIndex = 0;
    const logInterval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setBootLog(prev => [...prev, logs[currentLogIndex]]);
        setBootProgress(((currentLogIndex + 1) / logs.length) * 100);
        currentLogIndex++;
      } else {
        clearInterval(logInterval);
        setTimeout(() => setPhase('reveal'), 800);
        setTimeout(() => setPhase('ready'), 2000);
      }
    }, 400);

    return () => clearInterval(logInterval);
  }, []);

  const handleMatriculaChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newMatricula = [...matricula];
    newMatricula[index] = value.slice(-1);
    setMatricula(newMatricula);

    if (value && index < 5) {
      matriculaRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !matricula[index] && index > 0) {
      matriculaRefs[index - 1].current?.focus();
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (selectedRole === 'ADMIN') {
        if (email === 'maiconsillva2025@gmail.com' && password === '1285041') {
          onLogin({
            id: 'super-1',
            name: 'Maicon Silva',
            email: 'maiconsillva2025@gmail.com',
            role: UserRole.SUPER_DONO
          });
          navigate('/dashboard');
        } else {
          setError('Credenciais administrativas incorretas.');
        }
      } else if (selectedRole === 'CLIENTE') {
        const fullMatricula = matricula.join('');
        const storedRequests = JSON.parse(localStorage.getItem('isa_requests') || JSON.stringify(MOCK_REQUESTS));
        const approvedUser = storedRequests.find((r: any) => r.matricula === fullMatricula && r.status === 'APROVADO');

        if (approvedUser) {
          if (approvedUser.isBlocked) {
            setError('Sua conta está temporariamente bloqueada.');
          } else {
            onLogin({
              id: approvedUser.id,
              name: approvedUser.name,
              email: approvedUser.email,
              role: UserRole.CLIENTE,
              matricula: approvedUser.matricula
            });
            navigate('/dashboard');
          }
        } else {
          setError('Matrícula não encontrada ou pendente.');
        }
      }
      setLoading(false);
    }, 1500);
  };

  if (phase === 'boot') {
    return (
      <div className="min-h-screen bg-[#0A0A14] flex flex-col items-center justify-center p-8 font-mono text-cyan-400">
        <div className="max-w-md w-full space-y-8 animate-pulse">
          <div className="border border-cyan-500/30 p-6 rounded-lg bg-cyan-950/10">
            <h1 className="text-xl font-black mb-4 flex items-center gap-2">
              <Terminal size={20} /> INOVAPRO BOOT SEQUENCE
            </h1>
            <div className="space-y-2 h-40 overflow-hidden text-xs">
              {bootLog.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-[10px] font-bold">
                <span>SYSTEM STATUS</span>
                <span>{Math.round(bootProgress)}%</span>
              </div>
              <div className="h-1 w-full bg-cyan-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 transition-all duration-300 shadow-[0_0_10px_#00D4FF]" 
                  style={{ width: `${bootProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-center opacity-40">INOVAPRO TECHNOLOGY CORE V2.5.0</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Particle Overlay (CSS simulated) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className={`transition-all duration-1000 flex flex-col items-center gap-8 ${phase === 'reveal' ? 'opacity-0 scale-95 blur-md' : 'opacity-100 scale-100'}`}>
        
        {/* Central Robot Branding */}
        <div className="relative group text-center cursor-default">
          <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
          <div className="relative flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#121220] to-[#0A0A14] border-2 border-cyan-500/50 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,212,255,0.3)] mb-4 group-hover:rotate-[360deg] transition-transform duration-[2000ms]">
              <Bot size={48} className="text-cyan-400 animate-float" />
              <div className="absolute top-1/3 left-1/4 flex gap-6">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_#00D4FF]"></div>
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_#00D4FF]"></div>
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-tighter neon-text uppercase italic">ISA 2.5</h1>
            <p className="text-[10px] font-black tracking-[0.5em] text-gray-500 uppercase mt-1">Inteligência Operacional</p>
          </div>
        </div>

        {/* Main Interaction Container */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          
          {/* Cliente Card */}
          <div 
            onClick={() => !loading && setSelectedRole('CLIENTE')}
            className={`group glass rounded-[3rem] p-8 border-2 transition-all duration-500 cursor-pointer overflow-hidden relative ${
              selectedRole === 'CLIENTE' 
              ? 'border-cyan-500 ring-4 ring-cyan-500/10 scale-105 shadow-2xl z-20 md:translate-x-4' 
              : selectedRole === 'ADMIN' 
                ? 'opacity-40 scale-90 blur-[2px] pointer-events-none' 
                : 'border-white/5 hover:border-cyan-500/30 shadow-xl'
            }`}
          >
            {selectedRole === 'CLIENTE' ? (
              <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black flex items-center gap-3">
                    <Fingerprint className="text-cyan-400" /> ACESSO CLIENTE
                  </h3>
                  <button onClick={(e) => {e.stopPropagation(); setSelectedRole(null)}} className="p-2 hover:bg-white/5 rounded-full"><ArrowLeft size={18} /></button>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Matrícula (6 dígitos)</label>
                    <div className="flex justify-between gap-2">
                      {matricula.map((digit, i) => (
                        <input
                          key={i}
                          ref={matriculaRefs[i]}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleMatriculaChange(i, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(i, e)}
                          className="w-full aspect-square bg-[#0A0A14] border-2 border-white/10 rounded-2xl text-center text-xl font-mono font-bold focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,212,255,0.2)] focus:outline-none transition-all"
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-600 italic">* Use 782374 para acesso rápido.</p>
                  </div>

                  {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl flex items-center gap-3 animate-shake">
                    <AlertTriangle size={16} /> {error}
                  </div>}

                  <button 
                    type="submit" 
                    disabled={loading || matricula.some(d => !d)}
                    className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[1.8rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <>Acessar Painel <ArrowRight size={18}/></>}
                  </button>
                </form>

                <div className="pt-4 border-t border-white/5 text-center">
                  <button 
                    onClick={() => navigate('/solicitar-acesso')}
                    className="text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:text-white transition-colors"
                  >
                    Solicite sua matrícula agora <ChevronRight size={12} className="inline ml-1" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full justify-between gap-12">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-3xl flex items-center justify-center text-cyan-400">
                  <Fingerprint size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-2">CLIENTE</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Acesso exclusivo para parceiros com matrícula válida. Ative sua inteligência operacional agora.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                  Selecionar <ChevronRight size={14} />
                </div>
              </div>
            )}
          </div>

          {/* Admin Card */}
          <div 
            onClick={() => !loading && setSelectedRole('ADMIN')}
            className={`group glass rounded-[3rem] p-8 border-2 transition-all duration-500 cursor-pointer overflow-hidden relative ${
              selectedRole === 'ADMIN' 
              ? 'border-purple-600 ring-4 ring-purple-600/10 scale-105 shadow-2xl z-20 md:-translate-x-4' 
              : selectedRole === 'CLIENTE' 
                ? 'opacity-40 scale-90 blur-[2px] pointer-events-none' 
                : 'border-white/5 hover:border-purple-600/30 shadow-xl'
            }`}
          >
             {selectedRole === 'ADMIN' ? (
              <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                 <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black flex items-center gap-3">
                    <ShieldCheck className="text-purple-500" /> ACESSO ADMIN
                  </h3>
                  <button onClick={(e) => {e.stopPropagation(); setSelectedRole(null)}} className="p-2 hover:bg-white/5 rounded-full"><ArrowLeft size={18} /></button>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email Corporativo</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-400 transition-colors" size={20} />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#0A0A14] border-2 border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-purple-500 focus:outline-none transition-all text-sm"
                        placeholder="admin@inovapro.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Senha Secreta</label>
                       <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[10px] text-gray-600 hover:text-white uppercase font-black">
                         {showPassword ? <EyeOff size={14}/> : <Eye size={14}/>}
                       </button>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-400 transition-colors" size={20} />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#0A0A14] border-2 border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-purple-500 focus:outline-none transition-all text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl animate-shake">
                    {error}
                  </div>}

                  <button 
                    type="submit" 
                    disabled={loading || !email || !password}
                    className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-[1.8rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-purple-600/20 hover:scale-105 transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <>Acessar Central <ArrowRight size={18}/></>}
                  </button>
                </form>

                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-600">
                  <button className="hover:text-white transition-colors">Esqueceu a senha?</button>
                  <button className="hover:text-white transition-colors">Suporte TI</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full justify-between gap-12">
                <div className="w-16 h-16 bg-purple-600/10 rounded-3xl flex items-center justify-center text-purple-500">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-2 uppercase">Admin</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Gerenciamento completo da plataforma, monitoramento de bots e análise estratégica em tempo real.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-purple-500 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                  Selecionar <ChevronRight size={14} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Technological Footer */}
        <div className="w-full max-w-lg mt-8 text-center space-y-4">
           <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
           <div className="flex flex-col items-center gap-2 opacity-30">
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="flex items-center gap-1"><Shield size={12}/> SSL Ativo</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span className="flex items-center gap-1"><Globe size={12}/> Global Server</span>
              </div>
              <p className="text-[9px] font-medium text-gray-500">Powered by INOVAPRO TECHNOLOGY • Build #20251226</p>
           </div>
        </div>
      </div>

      <style>{`
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .neon-text {
          color: #fff;
          text-shadow: 
            0 0 7px #fff,
            0 0 10px #00D4FF,
            0 0 21px #00D4FF;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
