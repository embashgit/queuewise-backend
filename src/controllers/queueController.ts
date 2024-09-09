import { Request, Response } from 'express';
import Queue from '../models/Queue';
import User from '../models/User';
import sequelize from '../config/config';



// Get all queues
export const getAllQueues = async (req: Request, res: Response): Promise<void> => {
  try {
    const queues = await Queue.findAll();

     res.status(200).json(queues);
return;
  } catch (error) {
    res.status(500).json({ message: 'Error fetching queues', error });
  }
};

// Create a new queue
export const createQueue = async (req: Request, res: Response): Promise<void> => {
  const { eventType, queueLength, estimatedWaitTime } = req.body;
  try {
    const newQueue = await Queue.create({ eventType, queueLength, estimatedWaitTime });
    res.status(201).json(newQueue);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error creating queue', error });
  }
};


// Get all users in a specific queue with join time, position, and estimated wait time
export const getQueueWithUserDetails = async (req: Request, res: Response): Promise<void> => {
  const queueId = req.params.queueId;

  try {
    const queue = await Queue.findOne({
      where: { id: queueId },
      include: [{
        model: User,
        through: { attributes: ['createdAt'] },  // Include the join time from UserQueue
        attributes: ['id', 'name', 'email'],
      }],
      order: [[sequelize.col('UserQueue.createdAt'), 'ASC']]  // Order users by join time
    });

    if (!queue) {
      res.status(404).json({ message: 'Queue not found' });
      return;
    }

    // Safely access the associated users
    const users = queue.get('Users') as User[];

    // Calculate position and estimated wait time for each user
    const usersWithDetails = users.map((user: any, index: number) => {
      const position = index + 1;  // Position in the queue
      const estimatedWaitTime = position * queue.estimatedWaitTime;  // Estimated wait time based on position

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        position,
        joinTime: user.UserQueue.createdAt,  // Time user joined the queue
        estimatedWaitTime,
      };
    });

    res.status(200).json({
      queueId: queue.id,
      eventType: queue.eventType,
      users: usersWithDetails,
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching queue details', error });
  }
};


