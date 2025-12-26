
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, MessageSquare, Shield, Zap, Globe, Cpu, Smartphone, 
  Bot, CheckCircle2, ShieldCheck, Lock, Fingerprint, Activity, 
  Send, Paperclip, Smile, MoreVertical, Terminal, Code, 
  User as UserIcon, Sparkles, ChevronRight, Play, Info, Star,
  Image as ImageIcon, QrCode, Users, Mail
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `
Você é a ISA 2.5, assistente operacional da INOVAPRO Technology.

SOBRE VOCÊ:
- Criada pela INOVAPRO Technology
- Foco em operações, automação e comunicação empresarial
- Integra WhatsApp, painéis administrativos e banco de dados
- Não é uma pessoa real, mas uma IA especializada

COMPORTAMENTO OBRIGATÓRIO:
✅ Linguagem clara, educada e objetiva
✅ Confirma entendimento antes de agir
✅ Respostas rápidas e precisas
✅ Foco em soluções práticas
✅ Manter padrão profissional em todos os canais

COMPORTAMENTO PROIBIDO:
❌ Não inventar informações
❌ Não expor credenciais ou dados sensíveis
❌ Não simular interações românticas
❌ Não usar dados fictícios (mocks) além dos citados aqui
❌ Não tratar pessoas com críticas ou comparações

CONTEXTO ATUAL:
- Usuário está testando na landing page
- Demonstração de funcionalidades
- Pode fazer perguntas sobre:
  * Integração WhatsApp
  * Painel administrativo
  * Sistema de faturamento (R$ 79,90/mês)
  * Segurança e criptografia
  * Funcionamento geral da ISA 2.5

RESPONDA como assistente profissional, focada em ajudar.
`;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', content: string}[]>([
    { role: 'model', content: 'Olá! Sou a ISA 2.5, a inteligência operacional da INOVAPRO. Como posso otimizar seu atendimento hoje? 😊' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSendMessage = async (customMsg?: string) => {
    const msg = customMsg || inputMessage;
    if (!msg.trim() || isTyping) return;

    const newMessages = [...chatMessages, { role: 'user', content: msg }] as {role: 'user' | 'model', content: string}[];
    setChatMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: newMessages.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
        }
      });

      setChatMessages(prev => [...prev, { role: 'model', content: response.text || 'Desculpe, tive um problema na conexão. Pode repetir?' }]);
    } catch (error) {
      console.error(error);
      setChatMessages(prev => [...prev, { role: 'model', content: 'Desculpe, o laboratório de testes está sob alta carga. Tente novamente em alguns segundos.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickQuestions = [
    "Como conecto meu WhatsApp?",
    "A ISA 2.5 é segura?",
    "Quais os planos e preços?",
    "Posso testar agora?"
  ];

  return (
    <div className="relative overflow-hidden bg-[#0A0A14] text-white selection:bg-cyan-500/30">
      {/* 3D Animated Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="grid-bg"></div>
      </div>

      {/* Floating Energy Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-cyan-400/10 blur-xl animate-float"
            style={{
              width: `${Math.random() * 150 + 100}px`,
              height: `${Math.random() * 150 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 15 + 15}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 lg:px-20 py-8 backdrop-blur-sm bg-[#0A0A14]/50 sticky top-0 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(0,212,255,0.5)]">ISA</div>
          <span className="text-2xl font-black tracking-tighter neon-text italic">ISA 2.5</span>
        </div>
        <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
          <a href="#demo" className="hover:text-cyan-400 transition-colors">Demonstração</a>
          <a href="#workflow" className="hover:text-cyan-400 transition-colors">Como Funciona</a>
          <a href="#security" className="hover:text-cyan-400 transition-colors">Segurança</a>
          <a href="#about" className="hover:text-cyan-400 transition-colors">Sobre</a>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-cyan-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-xl"
        >
          Entrar no Painel
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] text-center px-6 pt-20">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Zap size={14} className="animate-pulse" />
          <span>Inteligência Artificial de Próxima Geração</span>
        </div>
        <h1 className="text-6xl lg:text-[7rem] font-black mb-6 leading-[0.9] max-w-6xl tracking-tighter italic">
          OPERACIONAL <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">24H POR DIA</span>
        </h1>
        <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mb-12 font-medium">
          A assistente que transforma seu WhatsApp em um centro de operações inteligente. Automação humanizada com gestão em tempo real.
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <a href="#demo" className="group px-12 py-6 rounded-[2rem] bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-[0_0_40px_rgba(0,212,255,0.4)] transition-all flex items-center gap-3 font-black text-xs uppercase tracking-widest">
            Experimentar a IA Agora
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <button onClick={() => navigate('/solicitar-acesso')} className="px-12 py-6 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-black text-xs uppercase tracking-widest">
            Solicitar Acesso
          </button>
        </div>

        {/* Hero Bottom Elements */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 opacity-40">
           <div className="flex flex-col items-center gap-2">
             <span className="text-3xl font-black">99.8%</span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-500">Uptime</span>
           </div>
           <div className="flex flex-col items-center gap-2">
             <span className="text-3xl font-black">500+</span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-500">Empresas</span>
           </div>
           <div className="flex flex-col items-center gap-2">
             <span className="text-3xl font-black">2.5s</span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-500">Resposta</span>
           </div>
           <div className="flex flex-col items-center gap-2">
             <span className="text-3xl font-black">AES</span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-500">Encryption</span>
           </div>
        </div>
      </section>

      {/* IA Demo Section (FASE 2) */}
      <section id="demo" className="relative z-10 px-6 lg:px-20 py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
          
          {/* Left: Content */}
          <div className="lg:w-1/2 space-y-10">
             <div className="space-y-4">
                <h2 className="text-4xl lg:text-6xl font-black tracking-tighter italic">DEMONSTRAÇÃO <br /><span className="text-cyan-400">FUNCIONAL</span></h2>
                <div className="h-1.5 w-32 bg-gradient-to-r from-cyan-500 to-transparent rounded-full"></div>
                <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                  Interaja agora mesmo com a ISA 2.5. Sinta a velocidade e a precisão das respostas da inteligência operacional da INOVAPRO.
                </p>
             </div>

             <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Perguntas Rápidas</p>
                <div className="flex flex-wrap gap-3">
                  {quickQuestions.map((q, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSendMessage(q)}
                      className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-cyan-500 hover:text-cyan-400 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
             </div>

             <div className="grid grid-cols-2 gap-8 pt-8">
                <div className="space-y-2">
                   <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                     <Zap size={20} />
                   </div>
                   <h4 className="font-black text-sm uppercase">Processamento Groq</h4>
                   <p className="text-xs text-gray-500">Latência ultra-baixa com modelos Mixtral 8x7B.</p>
                </div>
                <div className="space-y-2">
                   <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                     <Bot size={20} />
                   </div>
                   <h4 className="font-black text-sm uppercase">ISA Core 2.5</h4>
                   <p className="text-xs text-gray-500">Motor proprietário focado em operações empresariais.</p>
                </div>
             </div>
          </div>

          {/* Right: Mobile Mockup */}
          <div className="lg:w-1/2 flex justify-center perspective-1000">
            <div className="w-[340px] h-[680px] bg-[#0A0A14] rounded-[3.5rem] border-[12px] border-gray-900 shadow-[0_0_100px_rgba(0,212,255,0.15)] relative overflow-hidden flex flex-col group animate-in slide-in-from-right-12 duration-1000">
               {/* iPhone Notch */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl z-50 flex items-center justify-center gap-4">
                  <div className="w-12 h-1 bg-white/10 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/10 rounded-full"></div>
               </div>

               {/* Chat Header */}
               <div className="p-10 pt-14 bg-[#121220] border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center">
                      <Bot size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black italic tracking-widest uppercase">ISA 2.5</h4>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[8px] font-bold text-gray-500 uppercase">Online Agora</span>
                      </div>
                    </div>
                  </div>
                  <MoreVertical size={16} className="text-gray-600" />
               </div>

               {/* Chat Area */}
               <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-chat-grid">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                      <div className={`p-4 rounded-2xl text-[11px] font-medium max-w-[85%] leading-relaxed ${
                        m.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none border border-white/5'
                      }`}>
                        {m.content}
                        <div className={`text-[8px] mt-2 opacity-50 text-right`}>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                      <div className="bg-gray-800 border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef}></div>
               </div>

               {/* Chat Input */}
               <div className="p-6 bg-[#121220] border-t border-white/5">
                  <div className="flex items-center gap-3 bg-gray-950 border border-gray-800 rounded-2xl p-2 pl-4">
                    <input 
                      type="text" 
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Fale com a ISA..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-[11px] py-2"
                    />
                    <button 
                      onClick={() => handleSendMessage()}
                      disabled={!inputMessage.trim() || isTyping}
                      className="p-3 bg-cyan-500 rounded-xl text-white shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                  <div className="mt-4 flex justify-center gap-4 opacity-30">
                    <Paperclip size={14} />
                    {/* Fix: Added ImageIcon to imports */}
                    <ImageIcon size={14} />
                    <Smile size={14} />
                  </div>
               </div>
            </div>
            
            {/* Visual Decorative Glow for Mobile */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-500/10 blur-[120px] rounded-full -z-10 group-hover:bg-cyan-500/20 transition-all duration-1000"></div>
          </div>
        </div>
      </section>

      {/* Timeline "Como Funciona" (FASE 3) */}
      <section id="workflow" className="relative z-10 px-6 lg:px-20 py-32 bg-[#05050A]/80 border-y border-white/5">
         <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter italic mb-4">FLUXO DE <span className="text-purple-500">OPERAÇÃO</span></h2>
            <p className="text-gray-500 text-sm font-black uppercase tracking-[0.3em]">Integrado • Seguro • Eficiente</p>
         </div>

         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent -translate-y-1/2 opacity-20"></div>
            
            {[
              /* Fix: Added QrCode to imports */
              { step: "01", icon: <QrCode size={32}/>, title: "CONEXÃO", desc: "Escaneie o QR Code seguro e conecte sua conta WhatsApp oficial." },
              { step: "02", icon: <Bot size={32}/>, title: "IA OPERANDO", desc: "A ISA assume o atendimento 24h conforme sua memória configurada." },
              /* Fix: Added Users to imports */
              { step: "03", icon: <Users size={32}/>, title: "GESTÃO", desc: "Admin supervisiona e intervém em tempo real via dashboard." },
              { step: "04", icon: <Activity size={32}/>, title: "PAINEL", desc: "Todas as conversas e métricas centralizadas em uma única interface." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-8 relative group">
                 <div className="w-24 h-24 rounded-[2rem] bg-gray-950 border border-white/10 flex items-center justify-center text-cyan-400 shadow-2xl group-hover:scale-110 group-hover:border-cyan-500/50 transition-all duration-500 relative z-10">
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-gray-900 rounded-xl border border-white/10 flex items-center justify-center text-xs font-black">{item.step}</div>
                    {item.icon}
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-xl font-black italic tracking-widest">{item.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed max-w-[200px]">{item.desc}</p>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* Security Section (FASE 4) */}
      <section id="security" className="relative z-10 px-6 lg:px-20 py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-12">
              <div className="space-y-4">
                <span className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">Infraestrutura Crítica</span>
                <h2 className="text-4xl lg:text-6xl font-black tracking-tighter italic">SEGURANÇA <br /><span className="text-purple-500">MILITAR</span></h2>
                <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
                  Seus dados e de seus clientes são protegidos por camadas de criptografia de ponta a ponta e protocolos de autenticação avançados.
                </p>
              </div>

              <div className="space-y-6">
                 {[
                   { icon: <Lock />, label: "Criptografia TLS 1.3 em todas conexões" },
                   { icon: <ShieldCheck />, label: "Conformidade total com a LGPD" },
                   { icon: <Fingerprint />, label: "Autenticação biométrica e 2FA" },
                   { icon: <Activity />, label: "Monitoramento e detecção de anomalias 24/7" }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 p-5 bg-white/5 border border-white/5 rounded-3xl group hover:border-purple-500/30 transition-all">
                      <div className="w-12 h-12 bg-gray-950 rounded-2xl flex items-center justify-center text-purple-400 shadow-xl group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-gray-300">{item.label}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="relative flex justify-center">
              <div className="w-full max-w-lg glass rounded-[4rem] border-white/10 p-16 text-center space-y-10 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent -z-10"></div>
                 <div className="w-32 h-32 bg-purple-500/10 rounded-[3rem] flex items-center justify-center text-purple-400 mx-auto shadow-2xl animate-pulse">
                    <Shield size={64} />
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-3xl font-black tracking-tighter">BOT ATIVO 24/7</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                       Nossa infraestrutura detecta falhas e executa backups automáticos a cada 15 minutos, garantindo que sua operação nunca pare.
                    </p>
                 </div>
                 <div className="flex justify-center gap-4">
                    <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-xl">Certificado SSL</div>
                    <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-xl">ISO 27001</div>
                 </div>
              </div>
              {/* Extra Glows */}
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-cyan-500/10 blur-[100px] rounded-full"></div>
           </div>
        </div>
      </section>

      {/* About Section (FASE 8) */}
      <section id="about" className="relative z-10 px-6 lg:px-20 py-32 bg-[#05050A]/90 border-y border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
           
           {/* Left: Institution */}
           <div className="lg:w-3/5 space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center font-bold text-white shadow-lg">IP</div>
                   <span className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">INOVAPRO TECHNOLOGY</span>
                </div>
                <h2 className="text-4xl lg:text-6xl font-black tracking-tighter italic">TRANSFORMANDO <br /><span className="text-white">NEGÓCIOS</span></h2>
                <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                   Nossa missão é criar ferramentas digitais que realmente resolvem problemas operacionais, conectando pessoas e sistemas com inteligência, segurança e alta performance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-6">
                    <div className="flex items-center gap-3 text-cyan-400">
                       <Bot size={24} />
                       <h4 className="font-black text-sm uppercase tracking-widest">ISA 2.5</h4>
                    </div>
                    <ul className="space-y-3">
                       {["Suporte Inteligente", "Comunicação Unificada", "Gestão de Usuários", "Automação via WhatsApp"].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-xs text-gray-500 font-bold">
                            <CheckCircle2 size={14} className="text-cyan-500" /> {item}
                         </li>
                       ))}
                    </ul>
                 </div>
                 <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-6">
                    <div className="flex items-center gap-3 text-red-400">
                       <Shield size={24} />
                       <h4 className="font-black text-sm uppercase tracking-widest">VALORES</h4>
                    </div>
                    <ul className="space-y-3">
                       {["Transparência Total", "Dados Reais", "Segurança Extrema", "Suporte Especializado"].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-xs text-gray-500 font-bold">
                            <CheckCircle2 size={14} className="text-red-500" /> {item}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
           </div>

           {/* Right: Founder Card */}
           <div className="lg:w-2/5 flex flex-col justify-center">
              <div className="relative p-12 bg-gradient-to-br from-[#121220] to-[#0A0A14] rounded-[3.5rem] border-2 border-white/5 shadow-2xl overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 blur-3xl rounded-full -mr-12 -mt-12"></div>
                 <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/5 blur-3xl rounded-full -ml-12 -mb-12"></div>
                 
                 <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-start">
                       <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                         <Star size={32} />
                       </div>
                       <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600">Fundador</span>
                    </div>

                    <div className="space-y-4">
                       <p className="text-sm italic text-gray-300 leading-relaxed font-medium">
                          "Nossa missão é criar ferramentas que realmente resolvam problemas operacionais, com inteligência, segurança e eficiência."
                       </p>
                       <div className="pt-4 border-t border-white/5">
                          <h4 className="text-lg font-black italic tracking-widest text-white">FUNDADOR</h4>
                          <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">INOVAPRO TECHNOLOGY</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* CTA Section (FASE 11) */}
      <section className="relative z-10 px-6 py-32">
         <div className="max-w-5xl mx-auto glass rounded-[5rem] p-16 lg:p-32 text-center border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-600/10 -z-10"></div>
            
            <div className="space-y-10">
               <h2 className="text-4xl lg:text-7xl font-black tracking-tighter leading-[0.9] italic">PRONTO PARA O <br /><span className="text-cyan-400">FUTURO?</span></h2>
               <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
                  Teste a ISA 2.5 agora e descubra como a inteligência operacional pode transformar o seu negócio.
               </p>
               
               <div className="flex flex-col md:flex-row justify-center gap-6 pt-8">
                  <button 
                    onClick={() => navigate('/solicitar-acesso')}
                    className="group px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[2.5rem] font-black text-xs uppercase tracking-widest text-white shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3"
                  >
                    Iniciar Teste Gratuito
                    <Play size={18} fill="currentColor" />
                  </button>
                  <button 
                    className="px-12 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] font-black text-xs uppercase tracking-widest text-gray-300 hover:bg-white/10 transition-all"
                  >
                    Falar com Especialista
                  </button>
               </div>

               <div className="flex items-center justify-center gap-6 pt-10 text-gray-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-cyan-500" />
                    <span className="text-[10px] font-black uppercase">IA Real Funcional</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-cyan-500" />
                    <span className="text-[10px] font-black uppercase">Faturamento R$ 79,90</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-cyan-500" />
                    <span className="text-[10px] font-black uppercase">Setup Zero</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer (FASE 12) */}
      <footer className="relative z-10 px-6 lg:px-20 py-20 bg-[#05050A] border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-cyan-500 flex items-center justify-center font-bold">ISA</div>
                <span className="font-bold text-xl tracking-tighter italic">ISA 2.5</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                A assistente inteligente da INOVAPRO Technology, criada para transformar operações e automatizar a comunicação empresarial.
              </p>
           </div>

           <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Plataforma</h4>
              <ul className="space-y-4 text-xs font-bold text-gray-600">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Integrações</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Segurança</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Preços</a></li>
              </ul>
           </div>

           <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Contatos</h4>
              <ul className="space-y-4 text-xs font-bold text-gray-600">
                <li className="flex items-center gap-2"><Globe size={14}/> www.inovapro.tech</li>
                {/* Fix: Added Mail to imports */}
                <li className="flex items-center gap-2"><Mail size={14}/> suporte@inovapro.tech</li>
                <li className="flex items-center gap-2"><Smartphone size={14}/> comercial@inovapro.tech</li>
              </ul>
           </div>

           <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Certificações</h4>
              <div className="flex flex-wrap gap-3">
                 <div className="w-12 h-12 bg-gray-950 border border-white/10 rounded-xl flex items-center justify-center text-gray-500"><Shield size={20}/></div>
                 <div className="w-12 h-12 bg-gray-950 border border-white/10 rounded-xl flex items-center justify-center text-gray-500"><Lock size={20}/></div>
                 <div className="w-12 h-12 bg-gray-950 border border-white/10 rounded-xl flex items-center justify-center text-gray-500"><Zap size={20}/></div>
              </div>
           </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-600">
           <p className="text-[10px] font-bold uppercase tracking-widest">© 2025 INOVAPRO TECHNOLOGY. TODOS OS DIREITOS RESERVADOS.</p>
           <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
           </div>
        </div>
      </footer>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .bg-chat-grid {
          background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .neon-text {
          text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
