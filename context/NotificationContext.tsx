
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';

export interface Notification {
  id: string;
  type: 'message' | 'request' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  targetRoles: UserRole[]; // Define quem pode ver esta notificação
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: (userRole: UserRole) => number;
  addNotification: (n: Omit<Notification, 'id' | 'read' | 'time'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (userRole: UserRole) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { 
      id: 'notif-1', 
      type: 'system', 
      title: 'Boas-vindas', 
      message: 'Bem-vindo à plataforma ISA 2.5! Explore suas ferramentas no menu lateral.', 
      time: 'Agora', 
      read: false,
      targetRoles: [UserRole.SUPER_DONO, UserRole.ADMIN, UserRole.CLIENTE]
    },
    { 
      id: 'notif-2', 
      type: 'request', 
      title: 'Nova Solicitação', 
      message: 'Há um novo pedido de acesso pendente de análise.', 
      time: 'Há 5m', 
      read: false,
      targetRoles: [UserRole.SUPER_DONO, UserRole.ADMIN] // Apenas Admin vê solicitações
    },
  ]);

  const unreadCount = (userRole: UserRole) => 
    notifications.filter(n => !n.read && n.targetRoles.includes(userRole)).length;

  const addNotification = (n: Omit<Notification, 'id' | 'read' | 'time'>) => {
    const newNotification: Notification = {
      ...n,
      id: Math.random().toString(36).substr(2, 9),
      read: false,
      time: 'Agora',
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = (userRole: UserRole) => {
    setNotifications(prev => prev.map(n => 
      n.targetRoles.includes(userRole) ? { ...n, read: true } : n
    ));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
