import { WebSocket, WebSocketServer } from 'ws';
import { verifyToken } from './auth.js';

let wss;

export const initializeWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on('connection', async (ws, req) => {
    try {
      
      const url = new URL(req.url, 'http://localhost');
      const token = url.searchParams.get('token');
      
      if (!token) {
        ws.close(1008, 'Authentication required');
        return;
      }

      const user = await verifyToken(token);
      ws.userId = user._id;
      ws.userRole = user.role;

      ws.isAlive = true;
      ws.on('pong', () => { ws.isAlive = true; });

      
      ws.send(JSON.stringify({
        type: 'connection',
        status: 'success',
        userId: user._id,
        role: user.role
      }));

      ws.on('message', (data) => {
        handleMessage(ws, data);
      });

      ws.on('close', () => {
        console.log(`Client ${ws.userId} disconnected`);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${ws.userId}:`, error);
      });

    } catch (error) {
      console.error('WebSocket connection error:', error);
      ws.close(1008, 'Authentication failed');
    }
  });

  
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });
};

const handleMessage = async (ws, data) => {
  try {
    const message = JSON.parse(data);
    
    switch (message.type) {
      case 'location_update':
        await handleLocationUpdate(ws, message);
        break;
      case 'status_update':
        await handleStatusUpdate(ws, message);
        break;
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  } catch (error) {
    console.error('Error handling message:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Error processing message'
    }));
  }
};

const handleLocationUpdate = async (ws, message) => {
  if (ws.userRole !== 'driver') {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Unauthorized to send location updates'
    }));
    return;
  }

  
  broadcastToRole('parent', {
    type: 'location_update',
    data: message.data
  });
};

const handleStatusUpdate = async (ws, message) => {
  if (!['driver', 'admin'].includes(ws.userRole)) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Unauthorized to send status updates'
    }));
    return;
  }

  
  broadcastToRole('parent', {
    type: 'status_update',
    data: message.data
  });
};

export const broadcastToRole = (role, data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.userRole === role) {
      client.send(JSON.stringify(data));
    }
  });
};

export const sendToUser = (userId, data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.userId === userId.toString()) {
      client.send(JSON.stringify(data));
    }
  });
};

export const broadcastToAll = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};