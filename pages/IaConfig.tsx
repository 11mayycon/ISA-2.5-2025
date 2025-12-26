
import React, { useState, useEffect, useRef } from 'react';
import { User, IaTrigger, Attachment } from '../types';
import { 
  Zap, Plus, Trash2, Edit2, Check, X, FileText, 
  ImageIcon, Link as LinkIcon, Search,
  Settings2, Save, Upload, Info, Download,
  LayoutGrid, List, Eye, Share2,
  Clock, Shield, Tag, CloudUpload, CheckCircle2, 
  Star, Sparkles, ChevronRight, ChevronLeft,
  MessageSquare, Sliders, Play, RotateCcw, Copy,
  User as UserIcon, Bot, Wand2, Target
} from 'lucide-react';

export default function IaConfig({ user }: { user: User }) {
  // --- STATE ---
  const [triggers, setTriggers] = useState<IaTrigger[]>([
    { 
      id: 't1', 
      keywords: ['preço', 'valor', 'quanto', 'custo', 'tabela'], 
      actionType: 'AUTO_SEND', 
      attachmentId: 'a1', 
      message: 'Olá {cliente_nome}! Seguem nossos valores atualizados para 2024. 📚',
      delay: 2,
      exactMatch: false
    },
    { 
      id: 't2', 
      keywords: ['frete', 'entrega', 'envio'], 
      actionType: 'OFFER', 
      attachmentId: 'a2', 
      message: 'Aqui está nossa tabela de frete regional, {cliente_nome}. 🚚',
      delay: 1,
      exactMatch: false
    }
  ]);
  
  const [attachments, setAttachments] = useState<Attachment[]>([
    { 
      id: 'a1', name: 'catalogo_2024.pdf', displayName: 'Catálogo de Produtos 2024', type: 'pdf', 
      url: '#', category: 'Produtos', subCategory: 'Catálogos', tags: ['catálogo', 'preços', '2024'], 
      uses: 45, size: '4.2 MB', uploadDate: '2024-12-15', visibility: 'Public', views: 128, rating: 4.8 
    },
    { 
      id: 'a2', name: 'tabela_frete.jpg', displayName: 'Tabela de Frete Regional', type: 'image', 
      url: '#', category: 'Financeiro', tags: ['frete', 'entrega'], 
      uses: 12, size: '1.8 MB', uploadDate: '2024-12-20', visibility: 'Public', views: 42 
    }
  ]);

  const [activeProfile, setActiveProfile] = useState('VENDEDOR');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Triggers Specific State
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<Partial<IaTrigger> | null>(null);
  const [testMessage, setTestMessage] = useState('');
  const [testResult, setTestResult] = useState<{success: boolean, trigger?: IaTrigger, confidence?: number} | null>(null);

  // Attachment Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [newFileData, setNewFileData] = useState<Partial<Attachment>>({
    displayName: '',
    category: 'Produtos',
    visibility: 'Public',
    tags: []
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- HANDLERS ---
  const handleOpenTriggerEditor = (trigger?: IaTrigger) => {
    setEditingTrigger(trigger || {
      keywords: [],
      actionType: 'AUTO_SEND',
      attachmentId: attachments[0]?.id || '',
      message: 'Olá {cliente_nome}! Aqui está o que você solicitou. 😊',
      delay: 2
    });
    setIsTriggerModalOpen(true);
  };

  const handleSaveTrigger = () => {
    if (!editingTrigger) return;
    
    if (editingTrigger.id) {
      setTriggers(prev => prev.map(t => t.id === editingTrigger.id ? (editingTrigger as IaTrigger) : t));
    } else {
      const newTrigger = { ...editingTrigger, id: `t-${Date.now()}` } as IaTrigger;
      setTriggers(prev => [newTrigger, ...prev]);
    }
    setIsTriggerModalOpen(false);
    setEditingTrigger(null);
  };

  const testTriggerLogic = () => {
    const msg = testMessage.toLowerCase();
    const found = triggers.find(t => 
      t.keywords.some(k => msg.includes(k.toLowerCase()))
    );

    if (found) {
      setTestResult({ success: true, trigger: found, confidence: 95 + Math.random() * 4 });
    } else {
      setTestResult({ success: false });
    }
  };

  const insertVariable = (variable: string) => {
    if (!editingTrigger) return;
    setEditingTrigger({
      ...editingTrigger,
      message: (editingTrigger.message || '') + ` {${variable}} `
    });
  };

  // Upload Logic (Simulated)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFileData({
        ...newFileData,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'link'
      });
      setUploadStep(2);
    }
  };

  const startSimulatedUpload = () => {
    setUploadStep(3);
    setUploadProgress(0);
    const stages = ['Preparando...', 'Analisando...', 'Otimizando...', 'Enviando...', 'Finalizando...'];
    let currentStage = 0;
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus('Concluído!');
          setTimeout(() => {
            const attachment: Attachment = {
              id: `a-${Date.now()}`,
              name: newFileData.name || 'arquivo',
              displayName: newFileData.displayName || 'Novo Anexo',
              type: newFileData.type || 'pdf',
              url: '#',
              category: newFileData.category || 'Produtos',
              uses: 0,
              size: newFileData.size || '0 MB',
              uploadDate: new Date().toISOString().split('T')[0],
              visibility: newFileData.visibility || 'Public',
              views: 0
            };
            setAttachments([attachment, ...attachments]);
            setIsUploadModalOpen(false);
            setUploadStep(1);
          }, 1000);
          return 100;
        }
        const newProgress = prev + 10;
        setUploadStatus(stages[Math.floor(newProgress / 25)] || stages[4]);
        return newProgress;
      });
    }, 200);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      
      {/* Profile Selector */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <Zap className="text-yellow-400" /> Inteligência Operacional
            </h2>
            <p className="text-gray-500 text-sm mt-1">Configure como a IA deve reagir a intenções específicas dos clientes.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 'VENDEDOR', label: 'Perfil Vendedor', desc: 'Foco em conversão e envio de catálogos.', icon: <Zap className="text-yellow-400" /> },
            { id: 'SUPORTE', label: 'Perfil Suporte', desc: 'Foco em resoluções e manuais técnicos.', icon: <Settings2 className="text-cyan-400" /> },
            { id: 'AGENDADOR', label: 'Perfil Agendador', desc: 'Foco em calendários e termos.', icon: <RotateCcw className="text-purple-400" /> }
          ].map(p => (
            <button 
              key={p.id}
              onClick={() => setActiveProfile(p.id)}
              className={`p-8 text-left rounded-[2.5rem] border transition-all relative overflow-hidden group ${
                activeProfile === p.id 
                ? 'bg-[#121220] border-cyan-400/50 shadow-[0_10px_40px_rgba(0,212,255,0.1)]' 
                : 'bg-[#121220] border-gray-800 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-950 flex items-center justify-center border border-white/5">
                   {p.icon}
                </div>
                {activeProfile === p.id && <div className="p-1 bg-cyan-400 rounded-full"><Check size={12} className="text-black" /></div>}
              </div>
              <h4 className="text-lg font-bold mb-2">{p.label}</h4>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">{p.desc}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Triggers Section (LEFT) */}
        <section className="lg:col-span-7 space-y-6">
           <div className="flex justify-between items-center bg-[#121220] p-6 rounded-[2.5rem] border border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Target size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Gatilhos Inteligentes</h3>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{triggers.length} Ativos</p>
                </div>
              </div>
              <button 
                onClick={() => handleOpenTriggerEditor()}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-cyan-500/20"
              >
                <Plus size={18} /> Novo Trigger
              </button>
           </div>

           <div className="space-y-4">
             {triggers.map(t => (
               <div key={t.id} className="p-8 bg-[#121220] border border-gray-800 rounded-[3rem] space-y-6 group hover:border-cyan-500/30 transition-all relative overflow-hidden">
                 <div className="flex justify-between items-start">
                    <div className="flex flex-wrap gap-2">
                      {t.keywords.map(k => (
                        <span key={k} className="px-3 py-1.5 bg-gray-900 text-cyan-400 text-[10px] font-black uppercase rounded-xl border border-white/5 shadow-inner">
                          {k}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenTriggerEditor(t)} className="p-3 bg-gray-950 border border-white/5 rounded-xl text-gray-500 hover:text-white transition-all"><Edit2 size={16} /></button>
                      <button onClick={() => setTriggers(prev => prev.filter(x => x.id !== t.id))} className="p-3 bg-gray-950 border border-white/5 rounded-xl text-gray-500 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                    </div>
                 </div>

                 <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 p-5 bg-gray-950/50 rounded-[1.8rem] border border-white/5 space-y-3">
                       <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">Mensagem de Resposta</p>
                       <p className="text-xs text-gray-300 italic leading-relaxed">"{t.message}"</p>
                    </div>
                    <div className="w-full md:w-56 p-5 bg-cyan-500/5 rounded-[1.8rem] border border-cyan-500/10 flex flex-col justify-center items-center text-center">
                       <FileText size={24} className="text-cyan-400 mb-2" />
                       <p className="text-[10px] text-white font-bold truncate w-full">
                         {attachments.find(a => a.id === t.attachmentId)?.displayName || 'Anexo removido'}
                       </p>
                       <p className="text-[8px] text-cyan-500 font-black uppercase tracking-widest mt-1">Envio em {t.delay}s</p>
                    </div>
                 </div>
               </div>
             ))}
           </div>
        </section>

        {/* Attachment & Testing (RIGHT) */}
        <div className="lg:col-span-5 space-y-8">
           
           {/* Testing Lab */}
           <section className="bg-[#121220] border border-gray-800 rounded-[3rem] p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Wand2 size={20} className="text-purple-400" />
                <h3 className="font-bold">Laboratório de Teste</h3>
              </div>
              <div className="space-y-4">
                 <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Simule uma mensagem do cliente..."
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && testTriggerLogic()}
                      className="w-full bg-gray-950 border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                    />
                    <button 
                      onClick={testTriggerLogic}
                      className="absolute right-2 top-2 p-2.5 bg-purple-600 rounded-xl text-white hover:scale-105 transition-all"
                    >
                      <Play size={16} />
                    </button>
                 </div>

                 {testResult && (
                    <div className={`p-6 rounded-2xl border animate-in zoom-in duration-300 ${testResult.success ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                       <div className="flex items-center gap-3 mb-2">
                          {testResult.success ? <CheckCircle2 size={18} className="text-green-500" /> : <X size={18} className="text-red-500" />}
                          <p className={`text-xs font-bold ${testResult.success ? 'text-green-400' : 'text-red-400'}`}>
                            {testResult.success ? 'GATILHO ACIONADO!' : 'NENHUM GATILHO DETECTADO'}
                          </p>
                       </div>
                       {testResult.success && (
                         <div className="space-y-2 mt-4">
                            <div className="flex justify-between text-[10px] font-black uppercase">
                               <span className="text-gray-500">Confiança</span>
                               <span className="text-green-500">{testResult.confidence?.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
                               <div className="h-full bg-green-500" style={{ width: `${testResult.confidence}%` }}></div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-4 leading-relaxed">
                               A IA enviará: <span className="text-white font-bold">{attachments.find(a => a.id === testResult.trigger?.attachmentId)?.displayName}</span>
                            </p>
                         </div>
                       )}
                    </div>
                 )}
              </div>
           </section>

           {/* Quick Library Access */}
           <section className="bg-[#121220] border border-gray-800 rounded-[3rem] p-8 space-y-6">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <CloudUpload size={20} className="text-cyan-400" />
                   <h3 className="font-bold">Sua Biblioteca</h3>
                 </div>
                 <button onClick={() => setIsUploadModalOpen(true)} className="p-2 bg-gray-950 border border-white/5 rounded-xl hover:text-cyan-400 transition-all"><Plus size={18}/></button>
              </div>
              <div className="space-y-3">
                 {attachments.map(a => (
                   <div key={a.id} className="p-4 bg-gray-950/50 border border-white/5 rounded-2xl flex items-center gap-4 hover:border-cyan-500/20 transition-all cursor-default">
                      <div className={`w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center ${a.type === 'pdf' ? 'text-red-400' : 'text-cyan-400'}`}>
                         {a.type === 'pdf' ? <FileText size={20} /> : <ImageIcon size={20} />}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold truncate">{a.displayName}</p>
                        <p className="text-[9px] text-gray-500 uppercase font-black">{a.size} • {a.uses} USOS</p>
                      </div>
                   </div>
                 ))}
              </div>
           </section>
        </div>
      </div>

      {/* Trigger Editor Modal */}
      {isTriggerModalOpen && editingTrigger && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-[#121220] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="flex flex-col lg:flex-row h-[85vh]">
               {/* Left: Configuration */}
               <div className="lg:w-1/2 p-10 space-y-8 border-r border-white/5 overflow-y-auto custom-scrollbar">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-black">{editingTrigger.id ? 'Editar Trigger' : 'Novo Trigger'}</h3>
                    <button onClick={() => setIsTriggerModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">🔑 Palavras-Chave</label>
                       <input 
                        type="text" 
                        value={editingTrigger.keywords?.join(', ')}
                        onChange={(e) => setEditingTrigger({...editingTrigger, keywords: e.target.value.split(',').map(s => s.trim())})}
                        placeholder="preço, quanto, valor..."
                        className="w-full bg-gray-950 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                       />
                       <p className="text-[9px] text-gray-600 italic ml-1">* Separe por vírgula. A IA detectará se alguma dessas palavras estiver na mensagem.</p>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">📎 Anexo de Resposta</label>
                       <select 
                        value={editingTrigger.attachmentId}
                        onChange={(e) => setEditingTrigger({...editingTrigger, attachmentId: e.target.value})}
                        className="w-full bg-gray-950 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none"
                       >
                         {attachments.map(a => <option key={a.id} value={a.id}>{a.displayName} ({a.type.toUpperCase()})</option>)}
                       </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">⏱️ Delay de Envio</label>
                          <select 
                            value={editingTrigger.delay}
                            onChange={(e) => setEditingTrigger({...editingTrigger, delay: parseInt(e.target.value)})}
                            className="w-full bg-gray-950 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none"
                          >
                            <option value={0}>Imediato (0s)</option>
                            <option value={1}>1 segundo</option>
                            <option value={2}>2 segundos</option>
                            <option value={5}>5 segundos</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">🎯 Tipo de Ação</label>
                          <select 
                            value={editingTrigger.actionType}
                            onChange={(e) => setEditingTrigger({...editingTrigger, actionType: e.target.value as any})}
                            className="w-full bg-gray-950 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none"
                          >
                            <option value="AUTO_SEND">Enviar Automático</option>
                            <option value="OFFER">Oferecer Primeiro</option>
                          </select>
                       </div>
                    </div>
                  </div>
               </div>

               {/* Right: Message Composer & Preview */}
               <div className="lg:w-1/2 p-10 bg-gray-950/40 flex flex-col justify-between overflow-y-auto custom-scrollbar">
                  <div className="space-y-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">💬 Mensagem de Acompanhamento</label>
                       <textarea 
                        value={editingTrigger.message}
                        onChange={(e) => setEditingTrigger({...editingTrigger, message: e.target.value})}
                        rows={6}
                        className="w-full bg-gray-950 border border-white/10 rounded-3xl p-6 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                        placeholder="Escreva a mensagem que acompanhará o anexo..."
                       />
                       <div className="flex flex-wrap gap-2">
                          {['cliente_nome', 'empresa_nome', 'data_atual'].map(v => (
                            <button 
                              key={v}
                              onClick={() => insertVariable(v)}
                              className="px-3 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-black uppercase rounded-lg hover:bg-purple-500 hover:text-white transition-all"
                            >
                              + {v}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">👁️ Preview no WhatsApp</label>
                       <div className="bg-[#0b141a] rounded-[2rem] p-6 shadow-2xl relative overflow-hidden border border-white/5">
                          <div className="flex flex-col gap-4">
                             <div className="self-end max-w-[85%] bg-[#005c4b] text-white p-4 rounded-2xl rounded-tr-none shadow-md space-y-3">
                                <p className="text-xs leading-relaxed">
                                  {editingTrigger.message?.replace(/{cliente_nome}/g, 'João').replace(/{empresa_nome}/g, 'ISA 2.5 Platform').replace(/{data_atual}/g, '26/12')}
                                </p>
                                <div className="p-3 bg-black/20 rounded-xl flex items-center gap-3">
                                   <div className="p-2 bg-white/10 rounded-lg text-white"><FileText size={16}/></div>
                                   <p className="text-[10px] font-bold truncate">
                                     {attachments.find(a => a.id === editingTrigger.attachmentId)?.displayName}
                                   </p>
                                </div>
                                <div className="flex justify-end items-center gap-1">
                                   <span className="text-[8px] opacity-60">14:30</span>
                                   <Check size={10} className="text-cyan-400" />
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-10">
                    <button onClick={() => setIsTriggerModalOpen(false)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">Cancelar</button>
                    <button 
                      onClick={handleSaveTrigger}
                      className="flex-[2] py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-[1.02] transition-all"
                    >
                      Salvar Gatilho
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal (Legacy from previous refactor for compatibility) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#121220] border border-white/10 rounded-[3rem] overflow-hidden">
             {uploadStep === 1 && (
               <div className="p-10 space-y-8 text-center">
                 <h3 className="text-xl font-bold">Upload para Biblioteca</h3>
                 <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-800 rounded-[2rem] p-12 hover:border-cyan-500/40 cursor-pointer">
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                    <CloudUpload size={48} className="mx-auto text-gray-700 mb-4" />
                    <p className="text-sm text-gray-500">Arraste ou clique para selecionar arquivo</p>
                 </div>
                 <button onClick={() => setIsUploadModalOpen(false)} className="text-xs font-bold text-gray-600 uppercase">Fechar</button>
               </div>
             )}
             {uploadStep === 2 && (
               <div className="p-10 space-y-6">
                  <h3 className="text-xl font-bold">Informações do Arquivo</h3>
                  <div className="space-y-4">
                     <input 
                      type="text" 
                      placeholder="Nome de Exibição"
                      value={newFileData.displayName}
                      onChange={(e) => setNewFileData({...newFileData, displayName: e.target.value})}
                      className="w-full bg-gray-950 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none"
                     />
                     <select className="w-full bg-gray-950 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none">
                        <option>Produtos</option>
                        <option>Suporte</option>
                        <option>Financeiro</option>
                     </select>
                  </div>
                  <button onClick={startSimulatedUpload} className="w-full py-4 bg-cyan-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl">Confirmar Upload</button>
               </div>
             )}
             {uploadStep === 3 && (
               <div className="p-16 text-center space-y-6">
                  <div className="relative w-24 h-24 mx-auto">
                     <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
                     <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
                     <div className="absolute inset-0 flex items-center justify-center font-black text-white text-lg">{uploadProgress}%</div>
                  </div>
                  <p className="font-bold">{uploadStatus}</p>
               </div>
             )}
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 212, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 212, 255, 0.4);
        }
      `}</style>
    </div>
  );
}
