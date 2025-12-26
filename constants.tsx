
import React from 'react';
import { 
  LayoutDashboard, MessageSquare, Bot, Users, Settings, 
  LifeBuoy, BarChart3, UserCircle, BellRing, 
  BrainCircuit, Smartphone, Zap, MessageCircle, DollarSign
} from 'lucide-react';
import { UserRole } from './types';

export const COLORS = {
  primary: '#00D4FF',
  secondary: '#7B42FF',
  dark: '#0A0A14',
  white: '#FFFFFF',
};

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: [UserRole.SUPER_DONO, UserRole.ADMIN, UserRole.CLIENTE] },
  
  // CLIENT SPECIFIC OPERATIONAL TOOLS
  { id: 'ai-memory', label: 'Memória IA', icon: <BrainCircuit size={20} />, roles: [UserRole.CLIENTE] },
  { id: 'whatsapp-manager', label: 'WhatsApp Manager', icon: <Smartphone size={20} />, roles: [UserRole.CLIENTE] },
  { id: 'whatsapp-chat', label: 'Chat WhatsApp', icon: <MessageCircle size={20} />, roles: [UserRole.CLIENTE] },
  { id: 'ia-config', label: 'Configurações IA', icon: <Zap size={20} />, roles: [UserRole.CLIENTE] },

  // ADMIN TOOLS
  { id: 'financial', label: 'Financeiro', icon: <DollarSign size={20} />, roles: [UserRole.SUPER_DONO, UserRole.ADMIN] },
  { id: 'whatsapp-bot', label: 'WhatsApp Bot', icon: <Bot size={20} />, roles: [UserRole.SUPER_DONO, UserRole.ADMIN] },
  { id: 'conversations', label: 'Minhas Conversas', icon: <MessageSquare size={20} />, roles: [UserRole.SUPER_DONO, UserRole.ADMIN] },
  { id: 'requests', label: 'Solicitações', icon: <Users size={20} />, roles: [UserRole.SUPER_DONO, UserRole.ADMIN] },
  { id: 'admin-notices', label: 'Avisos Admin', icon: <BellRing size={20} />, roles: [UserRole.SUPER_DONO, UserRole.ADMIN] },
  { id: 'reports', label: 'Relatórios', icon: <BarChart3 size={20} />, roles: [UserRole.SUPER_DONO, UserRole.ADMIN] },
  
  // COMMON
  { id: 'profile', label: 'Meu Perfil', icon: <UserCircle size={20} />, roles: [UserRole.SUPER_DONO, UserRole.ADMIN, UserRole.CLIENTE] },
  { id: 'settings', label: 'Configurações', icon: <Settings size={20} />, roles: [UserRole.SUPER_DONO, UserRole.ADMIN] },
  { id: 'support', label: 'Suporte', icon: <LifeBuoy size={20} />, roles: [UserRole.SUPER_DONO, UserRole.ADMIN, UserRole.CLIENTE] },
];

export const MOCK_REQUESTS = [
  {
    id: 'req-1',
    name: 'Maicon Silva',
    email: 'maiconsillva2025@gmail.com',
    cpf: '123.456.789-00',
    phone: '(11) 99999-9999',
    matricula: '782374',
    status: 'APROVADO',
    isBlocked: false,
    expiresAt: '2025-12-31',
    date: '2023-10-01',
    subscriptionStatus: 'ATIVO',
    monthlyValue: 79.90
  },
  {
    id: 'req-2',
    name: 'Ana Silva',
    email: 'ana@exemplo.com',
    cpf: '234.567.890-11',
    phone: '(21) 98888-8888',
    matricula: '123456',
    status: 'PENDENTE',
    isBlocked: false,
    date: '2023-10-15'
  }
];

export const MOCK_CONVERSATIONS = [
  { 
    id: 'conv-1', 
    name: 'João Carlos', 
    avatar: 'https://picsum.photos/seed/c1/100', 
    activeType: 'IA', 
    time: '11:20', 
    lastMessage: 'Qual o valor do plano Pro?', 
    unread: 2 
  },
  { 
    id: 'conv-2', 
    name: 'Maria Eduarda', 
    avatar: 'https://picsum.photos/seed/c2/100', 
    activeType: 'IA', 
    time: '09:45', 
    lastMessage: 'Aguardando o boleto.', 
    unread: 0 
  }
];
