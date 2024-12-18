import { Request, Response } from 'express';
import Queue from '../models/Queue';
import User from '../models/User';
import sequelize from '../config/config';
import { UserQueue } from '@src/models';
import { logQueueEvent } from '@src/service/queueEventService';
import QueueEvent from '@src/models/QueueEvent';


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
    res.status(500).json({ message: 'Queue Cannot be deleted, Users are on the Queue', error });
  }
};
export const getJoinedQueues = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id;  // Get the authenticated user ID from the JWT

  try {
    // Fetch all queues that the user has joined
    const joinedQueues = await Queue.findAll({
      include: [{
        model: User,
        where: { id: userId },
        attributes: [],  // We don't need any specific user attributes, so we leave this empty
        through: {
          attributes: []  // Exclude the join table attributes, if not needed
        }
      }],
      attributes: ['id', 'eventType','description', 'queueLength', 'estimatedWaitTime'],  // Fetch only necessary Queue fields
    });

    if (!joinedQueues || joinedQueues.length === 0) {
      res.status(404).json({ message: 'No joined queues found' });
      return;
    }

    const allJoinedQueue = await Promise.all(joinedQueues.map(async (queue) => {
      // Count the number of users in the queue using UserQueue model
      const userCount = await UserQueue.count({ where: { queueId: queue.id } });

      return {
        ...queue.get(), // Get the queue details
        userCount,      // Add the count of users in the waiting list
      };
    }));

    res.status(200).json({
      userId,
      allJoinedQueue
    });
    
  } catch (error) {
    console.error('Error fetching joined queues:', error);
    res.status(500).json({ message: 'Error fetching joined queues', error });
  }
};

export const leaveQueue = async (req: Request, res: Response): Promise<void> => {
  const { queueId } = req.params;
  const userId = (req as any).user.id;  // Get the authenticated user ID from the JWT

  try {
    // Find the queue to ensure it exists
    const queue = await Queue.findByPk(queueId);
    if (!queue) {
      res.status(404).json({ message: 'Queue not found' });
      return;
    }

    // Find the entry in the UserQueue table for this user and queue
    const userQueueEntry = await UserQueue.findOne({
      where: { userId, queueId }
    });

    if (!userQueueEntry) {
      res.status(404).json({ message: 'You have not joined this queue' });
      return;
    }

    // Delete the entry, effectively removing the user from the queue
    await userQueueEntry.destroy();

    res.status(200).json({ message: 'Successfully left the queue' });
  } catch (error) {
    console.error('Error leaving queue:', error);
    res.status(500).json({ message: 'Error leaving queue', error });
  }
};


// Get all queues
export const getAllQueues = async (req: Request, res: Response): Promise<void> => {
  try {
    const queues = await Queue.findAll();

    // Map through each queue to calculate the number of users waiting
    const queuesWithUserCounts = await Promise.all(queues.map(async (queue) => {
      // Count the number of users in the queue using UserQueue model
      const userCount = await UserQueue.count({ where: { queueId: queue.id } });

      return {
        ...queue.get(), // Get the queue details
        userCount,      // Add the count of users in the waiting list
      };
    }));

    res.status(200).json(queuesWithUserCounts);
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




export const getQueueWithUserDetails = async (req: Request, res: Response): Promise<void> => {
  const queueId = req.params.queueId;

  try {
    const queue = await Queue.findOne({
      where: { id: queueId },
      include: [{
        model: User,
        through: { attributes: ['createdAt', 'position'] },  // Include the position and createdAt fields from the UserQueue join table
        attributes: ['id', 'name', 'email'],  // Fetch only necessary User fields
      }],
      order: [[sequelize.literal('"Users->UserQueue"."position"'), 'ASC']]  // Order users by position
    });

    if (!queue) {
      res.status(404).json({ message: 'Queue not found' });
      return;
    }

    const users = queue.get('Users') as User[];

    // Map over the users to return the required details including position and estimated wait time
    const usersWithDetails = users.map((user: any) => {
      const position = user.UserQueue?.position || 0;
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
      queueLength: users.length,
      eventType: queue.eventType,
      users: usersWithDetails,
    });

  } catch (error) {
    console.error('Error fetching queue details:', error);
    res.status(500).json({ message: 'Error fetching queue details', error });
  }
};

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

   // Get the current maximum position in the queue
   const lastPersonInQueue = await UserQueue.findOne({
    where: { queueId },
    order: [['position', 'DESC']],  // Get the highest position
  });

     // Determine the new user's position: last position + 1, or 1 if the queue is empty
    const position = lastPersonInQueue ? lastPersonInQueue.position + 1 : 1;
    // Add the user to the queue with the calculated position
    const newUserQueue = await UserQueue.create({
      userId,
      queueId,
      position,
      isCurrent: false,  // The new user is not the current one in attendance
    });

    // Calculate the estimated wait time based on the number of users in the queue
    const estimatedWaitTime = position * queue.estimatedWaitTime;

    // Respond with position and estimated wait time
    res.status(201).json({
      message: 'You have joined the queue',
      queueId,
      position: position,  // The new user's position in the queue
      estimatedWaitTime,
      joinedAt: newUserQueue.createdAt,  // Automatically tracked by Sequelize
    });
  } catch (error) {
    console.error('Error joining queue:', error);
    res.status(500).json({ message: 'Error joining queue', error });
  }
};

// Call the next person in the queue
export const callNextUser = async (req: Request, res: Response): Promise<void> => {
  const queueId = req.params.queueId;
  const userId = req.body.userId;

  try {
    // Fetch the user with the lowest position in the queue
    const nextUser = await UserQueue.findOne({
      where: { queueId, userId },  // Ensure we're only fetching a user who is not currently in attendance
      order: [['position', 'ASC']]  // Fetch the user with the lowest position value
    });

    if (!nextUser) {
      res.status(404).json({ message: 'No users in the queue' });
      return;
    }

   
    await logQueueEvent(nextUser.userId, queueId, 'Called');

    // Reset the `isCurrent` flag for any other user currently marked as `isCurrent`
    await UserQueue.update(
      { isCurrent: false },
      { where: { queueId, isCurrent: true } }
    );

    // Set the `isCurrent` flag for the next user
    await nextUser.update({ isCurrent: true });

    res.status(200).json({ message: 'Next user called successfully', user: nextUser });

  } catch (error) {
    console.error('Error calling next user:', error);
    res.status(500).json({ message: 'Error calling next user', error });
  }
};


// Call the next person in the queue
export const removeFromAttendace = async (req: Request, res: Response): Promise<void> => {
  const queueId = req.params.queueId;

  try {
    // Get the first person in the queue based on the createdAt timestamp
    const firstPersonInQueue = await UserQueue.findOne({
      where: { queueId },
      order: [['createdAt', 'ASC']]  // Get the earliest joined user
    });

    if (!firstPersonInQueue) {
      res.status(404).json({ message: 'No users in the queue' });
      return;
    }

    // Log the event for when this user is called
    await logQueueEvent(firstPersonInQueue.userId, queueId, 'Complete');
    // Optionally, notify the user that it's their turn (if notifications are implemented)

    // Remove the user from the queue after they are called
    await firstPersonInQueue.destroy();

    res.status(200).json({ message: 'Next user called and removed from the queue successfully' });

  } catch (error) {
    console.error('Error calling next user:', error);
    res.status(500).json({ message: 'Error calling next user', error });
  }
};

export const getQueueEvents = async (req: Request, res: Response): Promise<void> => {
  const { queueId } = req.query;  // Get queueId and userId from query parameters

  try {
    // Build the query conditions based on the provided parameters
    const conditions: any = {};
    if (queueId) {
      conditions.queueId = queueId;
    }


    // Fetch events from the QueueEvent model, filtered by the provided conditions
    const events = await QueueEvent.findAll({
      where: conditions,
      order: [['eventTime', 'DESC']]  // Order by eventTime, most recent first
    });

    if (events.length === 0) {
      res.status(404).json({ message: 'No events found for the specified criteria' });
      return;
    }

    res.status(200).json({
      message: 'Events fetched successfully',
      events
    });

  } catch (error) {
    console.error('Error fetching queue events:', error);
    res.status(500).json({ message: 'Error fetching queue events', error });
  }
};