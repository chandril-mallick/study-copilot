import { useEffect, useCallback, useRef, useState } from 'react';
import websocketService from '../services/websocketService';
import type { WebSocketMessage, NotificationData } from '../types';

interface UseWebSocketOptions {
  enabled?: boolean;
  onNotification?: (data: NotificationData) => void;
  onAnnouncement?: (data: NotificationData) => void;
  onError?: (error: Event) => void;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  notifications: NotificationData[];
  clearNotifications: () => void;
  sendMessage: (type: string, data: unknown) => void;
  connect: (token: string) => void;
  disconnect: () => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const { 
    enabled = true, 
    onNotification, 
    onAnnouncement,
    onError 
  } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const handleMessage = useCallback((message: WebSocketMessage) => {
    setLastMessage(message);
    
    if (message.type === 'notification' && optionsRef.current.onNotification) {
      const notification: NotificationData = {
        id: `notif_${Date.now()}`,
        type: 'notification',
        title: 'New Notification',
        message: message.message || '',
        timestamp: Date.now(),
        read: false
      };
      setNotifications(prev => [notification, ...prev]);
      optionsRef.current.onNotification?.(notification);
    }
    
    if (message.type === 'announcement' && optionsRef.current.onAnnouncement) {
      const announcement: NotificationData = {
        id: `announce_${Date.now()}`,
        type: 'announcement',
        title: 'New Announcement',
        message: message.message || '',
        timestamp: Date.now(),
        read: false
      };
      setNotifications(prev => [announcement, ...prev]);
      optionsRef.current.onAnnouncement?.(announcement);
    }
  }, []);

  const connect = useCallback((token: string) => {
    if (!enabled) return;
    
    websocketService.connect(token);
    websocketService.subscribe('notification', handleMessage);
    websocketService.subscribe('announcement', handleMessage);
    setIsConnected(true);
  }, [enabled, handleMessage]);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((type: string, data: unknown) => {
    websocketService.send({ type, data });
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleError = (error: Event) => {
      optionsRef.current.onError?.(error);
    };

    websocketService.on('error', handleError);

    return () => {
      websocketService.off('error', handleError);
      websocketService.disconnect();
    };
  }, [enabled]);

  return {
    isConnected,
    lastMessage,
    notifications,
    clearNotifications,
    sendMessage,
    connect,
    disconnect
  };
}
