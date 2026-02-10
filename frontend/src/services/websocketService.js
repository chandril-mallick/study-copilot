// WebSocket Service for Real-Time Features
class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  connect(token) {
    const wsUrl = `ws://localhost:8000/ws?token=${token}`;
    
    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyListeners(data.type, data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected', event.code, event.reason);
        // Don't reconnect if it's an authentication error (1008) or normal closure (1000)
        if (event.code !== 1008 && event.code !== 1000) {
            this.attemptReconnect(token);
        } else if (event.code === 1008) {
            console.error("WebSocket Authentication failed. Session may be expired.");
            // Optional: Dispatch an event to log the user out
            // window.dispatchEvent(new CustomEvent('auth:session-expired'));
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  }

  attemptReconnect(token) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      setTimeout(() => this.connect(token), this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  subscribe(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  notifyListeners(eventType, data) {
    const callbacks = this.listeners.get(eventType) || [];
    callbacks.forEach(cb => {
      try {
        cb(data);
      } catch (error) {
        console.error('Error in WebSocket listener:', error);
      }
    });
  }

  send(message) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export default new WebSocketService();
