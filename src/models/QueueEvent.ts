import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/config';
import User from './User';
import Queue from './Queue';

class QueueEvent extends Model {
  public id!: string;
  public userId!: string;
  public queueId!: string;
  public event!: string;  // Type of event (e.g., called, missed, completed)
  public eventTime!: Date;  // Timestamp of the event
}

QueueEvent.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  queueId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  event: {
    type: DataTypes.STRING,
    allowNull: false  // Examples: 'called', 'missed', 'completed'
  },
  eventTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'QueueEvent',
  timestamps: false  // We are manually handling eventTime
});

// Associations
QueueEvent.belongsTo(User, { foreignKey: 'userId' });
QueueEvent.belongsTo(Queue, { foreignKey: 'queueId' });

export default QueueEvent;
