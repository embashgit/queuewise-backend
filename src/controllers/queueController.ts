import { Request, Response } from 'express';
import Queue from '../models/Queue';
import User from '../models/User';
import sequelize from '../config/config';
import { UserQueue } from '@src/models';


// Delete queue controller (admin only)
export const deleteQueue = async (req: Request, res: Response): Promise<void> => {
  const { queueId } = req.params;

  try {
    // Find the queue by ID
    const queue = await Queue.findByPk(queueId);
    
    if (!queue) {
      res.status(404).json({ message: 'Queue not found' });
      return;
    }

    // Delete the queue
    await queue.destroy();

    res.status(200).json({ message: 'Queue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting queue', error });
  }
};

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

// Create queue controller (admin or user)
export const createQueue = async (req: Request, res: Response): Promise<void> => {
  const { eventType, description, queueLength } = req.body;  // You can add more fields as needed

  try {
    // Create a new queue
    const newQueue = await Queue.create({
      eventType,       // The type of event or appointment
      description,
      queueLength,     // Additional details about the queue (optional)
    });

    // Respond with the newly created queue
    res.status(201).json({
      message: 'Queue created successfully',
      queue: newQueue
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating queue', error });
  }
};

// Update queue controller
export const updateQueue = async (req: Request, res: Response): Promise<void> => {
  const { queueId } = req.params;
  const { eventType, description, queueLength, estimatedWaitTime } = req.body;  // Fields to update

  try {
    // Find the queue by ID
    const queue = await Queue.findByPk(queueId);

    if (!queue) {
      res.status(404).json({ message: 'Queue not found' });
      return;
    }

    // Update the queue fields with the data provided
    queue.eventType = eventType ?? queue.eventType;  // If not provided, retain the existing value
    queue.description = description ?? queue.description;
    queue.queueLength = queueLength ?? queue.queueLength;
    queue.estimatedWaitTime = estimatedWaitTime ?? queue.estimatedWaitTime;

    // Save the updated queue
    await queue.save();

    res.status(200).json({
      message: 'Queue updated successfully',
      queue
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating queue', error });
  }
};

export const callFirstPersonInQueue = async (req: Request, res: Response): Promise<void> => {
  const queueId = req.params.queueId;

  try {
    // Find the first person (the one with the earliest createdAt timestamp)
    const firstPersonInQueue = await UserQueue.findOne({
      where: { queueId },
      order: [['createdAt', 'ASC']]  // Order by the earliest join time
    });

    if (!firstPersonInQueue) {
      res.status(404).json({ message: 'No users in the queue' });
      return;
    }

    // Remove the association from the UserQueue (removing this row essentially removes the user from the queue)
    await firstPersonInQueue.destroy();

    res.status(200).json({ message: 'First person removed from the queue' });

  } catch (error) {
    console.error('Error removing first person from the queue:', error);
    res.status(500).json({ message: 'Error removing first person from the queue', error });
  }
};


export const getQueueWithUserDetails = async (req: Request, res: Response): Promise<void> => {
  const queueId = req.params.queueId;

  try {
    const queue = await Queue.findOne({
      where: { id: queueId },
      include: [{
        model: User,
        through: { attributes: ['createdAt'] },  // Include the createdAt field from the UserQueue join table
        attributes: ['id', 'name', 'email'],  // Fetch only necessary User fields
      }],
      order: [[sequelize.literal('"Users->UserQueue"."createdAt"'), 'ASC']]  // Correctly reference the alias for UserQueue
    });

    if (!queue) {
      res.status(404).json({ message: 'Queue not found' });
      return;
    }

    const users = queue.get('Users') as User[];

    // Map over the users to calculate position and estimated wait time
    const usersWithDetails = users.map((user: any, index: number) => {
      const position = index + 1;
      const estimatedWaitTime = position * queue.estimatedWaitTime;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        position,
        joinTime: user.UserQueue?.createdAt || 'Unknown',  // Access join time from UserQueue
        estimatedWaitTime,
      };
    });

    res.status(200).json({
      queueId: queue.id,
      eventType: queue.eventType,
      users: usersWithDetails,
    });

  } catch (error) {
    console.error('Error fetching queue details:', error);
    res.status(500).json({ message: 'Error fetching queue details', error });
  }
};








// Join a queue
export const joinQueue = async (req: Request, res: Response): Promise<void> => {
  const { queueId } = req.params;
  const userId = (req as any).user.id;  // Get the authenticated user ID from the JWT


  try {
    // Find the queue by its ID
    const queue = await Queue.findByPk(queueId);
    if (!queue) {
      res.status(404).json({ message: 'Queue not found' });
      return;
    }

    // Check if the user is already in the queue
    const existingEntry = await UserQueue.findOne({ where: { userId, queueId } });
    if (existingEntry) {
      res.status(400).json({ message: 'You have already joined this queue' });
      return;
    }

    // Add the user to the queue
    const newUserQueue = await UserQueue.create({
      userId,
      queueId,
    });

    // Get the total number of people in the queue (position in the queue)
    const totalUsersInQueue = await UserQueue.count({ where: { queueId } });

    // Calculate the estimated wait time based on the number of users in the queue
    const estimatedWaitTime = totalUsersInQueue * queue.estimatedWaitTime;

    // Respond with position and estimated wait time
    res.status(201).json({
      message: 'You have joined the queue',
      queueId,
      position: totalUsersInQueue,
      estimatedWaitTime,
      joinedAt: newUserQueue.createdAt,  // Automatically tracked by Sequelize
    });
  } catch (error) {
    res.status(500).json({ message: 'Error joining queue', error });
  }
};


