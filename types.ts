
import React from 'react';

export enum UserRole {
  SUPER_DONO = 'SUPER_DONO',
  ADMIN = 'ADMIN',
  CLIENTE = 'CLIENTE'
}

export type SubscriptionStatus = 'ATIVO' | 'TESTE' | 'ATRASO' | 'SUSPENSO' | 'CANCELADO';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  matricula?: string;
  expiresAt?: string;
  isBlocked?: boolean;
  // Financial fields
  subscriptionStatus?: SubscriptionStatus;
  monthlyValue?: number;
  nextBillingDate?: string;
  totalRevenueGenerated?: number;
}

export interface Invoice {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: 'PAGO' | 'PENDENTE' | 'CANCELADO' | 'TESTE';
  dueDate: string;
  description: string;
  createdAt: string;
}

export interface SupportMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole | 'SYSTEM' | 'BOT' | 'CUSTOMER';
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'system';
  attachmentUrl?: string;
  read: boolean;
}

export interface SupportTicket {
  id: string;
  clientId: string;
  clientName: string;
  clientMatricula: string;
  subject: string;
  category: string;
  priority: 'BAIXA' | 'NORMAL' | 'ALTA' | 'URGENTE';
  status: 'PENDENTE' | 'EM_ATENDIMENTO' | 'FECHADO' | 'AGUARDANDO_CLIENTE';
  assignedTo?: string;
  assignedName?: string;
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
  unreadCountClient: number;
  unreadCountAdmin: number;
  positionInQueue?: number;
  rating?: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'INFORMATIVO' | 'IMPORTANTE' | 'URGENTE' | 'ATUALIZACAO' | 'MANUTENCAO';
  audience: 'TODOS' | string[];
  publishDate: string;
  expiryDate?: string;
  readBy: string[];
}

// NEW TYPES FOR ISA 2.5 EXPANSION
export interface AiMemory {
  businessName: string;
  industry: string;
  aiName: string;
  gender: 'Feminino' | 'Masculino' | 'Neutro';
  purpose: string[];
  personality: {
    formality: number; // 0 to 100
    enthusiasm: number;
    empathy: number;
  };
  tone: string;
  emojiFrequency: 'Nenhum' | 'Poucos' | 'Moderado' | 'Muitos';
  allowedEmojis: string[];
  officeHours: { start: string; end: string };
  outsideHoursAction: string;
  escalationRules: string[];
  knowledgeBase: { question: string; answer: string }[];
  products: { name: string; price: string; description: string }[];
}

export interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  time: string;
  unread: number;
  mode: 'IA' | 'HUMANO';
  avatar: string;
  messages: SupportMessage[];
}

export interface IaTrigger {
  id: string;
  keywords: string[];
  actionType: 'AUTO_SEND' | 'OFFER' | 'LINK';
  attachmentId: string;
  message: string;
  caseSensitive?: boolean;
  exactMatch?: boolean;
  delay?: number;
}

export interface Attachment {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  type: 'image' | 'pdf' | 'video' | 'audio' | 'link';
  url: string;
  category: string;
  subCategory?: string;
  tags?: string[];
  uses: number;
  size?: string;
  dimensions?: string;
  uploadDate: string;
  visibility: 'Public' | 'Restricted' | 'Private';
  views?: number;
  rating?: number;
}
