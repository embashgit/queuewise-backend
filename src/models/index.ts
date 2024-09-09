import User from './User';
import Queue from './Queue';
import sequelize from '../config/config';
import Notification from './Notification';
import UserQueue from './UserQueue';  // Import the custom join table model

// Define the many-to-many relationship using the custom UserQueue model
User.belongsToMany(Queue, { through: UserQueue, foreignKey: 'userId' });
Queue.belongsToMany(User, { through: UserQueue, foreignKey: 'queueId' });
// Define one-to-many relationship between User and Notification
User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// Sync models
const initializeModels = async () => {
  await sequelize.sync();
};

export { User, Queue, Notification, UserQueue, initializeModels };
