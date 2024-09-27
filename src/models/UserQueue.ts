import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/config';

class UserQueue extends Model {
  public userId!: string;
  public queueId!: string;
  public isCurrent!: boolean;
  public position!: number; // New field to track the user's position in the queue
  public createdAt!: Date;
  public updatedAt!: Date;
}

UserQueue.init({
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  queueId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Queues',
      key: 'id',
    },
  },
  isCurrent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Position is mandatory
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'UserQueue',
  timestamps: true,
});

export default UserQueue;
