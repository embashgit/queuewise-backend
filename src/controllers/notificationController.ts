import Notification from '../models/Notification';
import User from '../models/User';
import { Request, Response } from 'express';
// Example function to create a notification for a user
export const createNotification = async (req: Request, res: Response): Promise<void> => {
  const { userId, message } = req.body;
  try {
    // Ensure the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Create the notification
    const notification = await Notification.create({
      userId,
      message,
      status: 'pending',  // Initial status
    });

    res.status(201).json({ message: 'Notification created successfully', notification });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error });
  }
};


export const getUserNotifications = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    try {
      const notifications = await Notification.findAll({
        where: { userId }
      });
  
      if (!notifications) {
        res.status(404).json({ message: 'No notifications found for the user' });
        return;
      }
  
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching notifications', error });
    }
  };