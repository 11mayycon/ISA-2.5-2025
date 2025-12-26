
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft, Send, CheckCircle2, User as UserIcon, Mail, CreditCard, Phone, Briefcase, ChevronRight } from 'lucide-react';

const RegisterRequest: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    company: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInput = (field: string, value: string) => {
    let formatted = value;
    if (field === 'cpf') {
      formatted = value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').substring(0, 14);
    } else if (field === 'phone') {
      formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').substring(0, 15);
    }
    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Gerar matrícula numérica de 6 dígitos
      const matricula = Math.floor(100000 + Math.random() * 900000).toString();
      
      const newRequest = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        matricula,
        date: new Date().toISOString().split('T')[0],
        status: 'PENDENTE'
      };

      const existingRequests = JSON.parse(localStorage.getItem('isa_requests') || '[]');
      localStorage.setItem('isa_requests', JSON.stringify([newRequest, ...existingRequests]));
      
      localStorage.setItem('isa_current_request', JSON.stringify(newRequest));
      setLoading(false);
      navigate('/sala-de-espera');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-20"></div>
      
      <div className="w-full max-w-2xl relative z-10">
        <button 
          onClick={() => navigate('/login')}
          className="mb-8 flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Voltar ao Login</span>
        </button>

        <div className="glass rounded-[3rem] border-white/10 overflow-hidden shadow-2xl">
          {/* Header Progress */}
          <div className="bg-white/5 p-8 border-b border-white/5 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Solicitar Acesso</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Passo {step} de 1: Dados Pessoais</p>
            </div>
            <div className="flex gap-1">
              {[1].map((s) => (
                <div key={s} className={`h-1.5 w-12 rounded-full transition-all ${step === s ? 'bg-cyan-500' : 'bg-gray-800'}`}></div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Nome Completo</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-cyan-400" size={18} />
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => handleInput('name', e.target.value)}
                    className="w-full bg-gray-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm"
                    placeholder="Seu nome"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">E-mail</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-cyan-400" size={18} />
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => handleInput('email', e.target.value)}
                    className="w-full bg-gray-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">CPF</label>
                <div className="relative group">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-cyan-400" size={18} />
                  <input 
                    type="text" 
                    required
                    value={formData.cpf}
                    onChange={(e) => handleInput('cpf', e.target.value)}
                    className="w-full bg-gray-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">WhatsApp</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-cyan-400" size={18} />
                  <input 
                    type="text" 
                    required
                    value={formData.phone}
                    onChange={(e) => handleInput('phone', e.target.value)}
                    className="w-full bg-gray-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Empresa (Opcional)</label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-cyan-400" size={18} />
                  <input 
                    type="text" 
                    value={formData.company}
                    onChange={(e) => handleInput('company', e.target.value)}
                    className="w-full bg-gray-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm"
                    placeholder="Nome da empresa"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Cargo (Opcional)</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-cyan-400" size={18} />
                  <input 
                    type="text" 
                    value={formData.role}
                    onChange={(e) => handleInput('role', e.target.value)}
                    className="w-full bg-gray-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm"
                    placeholder="Seu cargo"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10">
              <CheckCircle2 size={18} className="text-cyan-400 mt-0.5" />
              <p className="text-xs text-gray-400 leading-relaxed">
                Ao solicitar acesso, você concorda com nossos termos. Suas informações serão analisadas pela equipe ISA para geração da sua matrícula exclusiva de 6 dígitos.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-black text-white shadow-xl hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-3 group"
            >
              {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                <>Enviar Solicitação <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterRequest;
