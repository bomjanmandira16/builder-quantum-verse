import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  unread: boolean;
  actionType?: 'week_completed' | 'data_uploaded' | 'report_generated' | 'team_update' | 'system';
  metadata?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'unread'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Load from localStorage on initialization
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('baatometrics-notifications');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error('Error loading saved notifications:', error);
        }
      }
    }
    // Default notifications
    return [
      {
        id: '1',
        type: 'info',
        title: 'Welcome to BaatoMetrics',
        message: 'Start mapping your first week to see progress tracking',
        time: '1 hour ago',
        unread: true,
        actionType: 'system'
      }
    ];
  });

  // Save to localStorage whenever notifications change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('baatometrics-notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const addNotification = (notificationData: Omit<Notification, 'id' | 'time' | 'unread'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      time: 'Just now',
      unread: true,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show browser notification if permission is granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/favicon.ico',
        tag: newNotification.id,
      });
    }

    // Auto-update time stamps
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(n => 
          n.id === newNotification.id 
            ? { ...n, time: '1 minute ago' }
            : n
        )
      );
    }, 60000);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, unread: false }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
