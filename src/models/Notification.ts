import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/config';
import User from './User';  // Ensure User model is imported for associations

class Notification extends Model {
  public id!: string;
  public userId!: string;
  public message!: string;
  public status!: string;
}

Notification.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'failed'),
    defaultValue: 'pending',
  },
}, {
  sequelize,
  modelName: 'Notification',
  timestamps: true,
});

// Define relationships (User has many Notifications)
User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

export default Notification;
