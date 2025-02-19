import  Notification  from '../models/notification.model.js';
import { sendToUser } from './websocket.js';

export const createNotification = async (userId, message, type = 'info') => {
  try {
    const notification = new Notification({
      userId,
      message,
      type
    });
    await notification.save();

    // Send real-time notification
    sendToUser(userId, {
      type: 'notification',
      data: notification
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};