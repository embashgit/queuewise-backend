import QueueEvent from '@src/models/QueueEvent';  // Import the QueueEvent model

// Function to log queue events
export const logQueueEvent = async (userId: string, queueId: string, event: string): Promise<void> => {
  try {
    await QueueEvent.create({
      userId,
      queueId,
      event,
      eventTime: new Date()  // Automatically set the event time to now
    });
  } catch (error) {
    console.error('Error logging queue event:', error);
  }
};
