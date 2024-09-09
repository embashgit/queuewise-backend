import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/config';
import User from './User';

class Queue extends Model {
  public id!: string;
  public eventType!: string;
  public queueLength!: number;
  public estimatedWaitTime!: number;
  description: any;
}

Queue.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  eventType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  queueLength: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0   // Default queue length to 0
  },
  estimatedWaitTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,  // Default estimated wait time to 0
  }
}, {
  sequelize,
  modelName: 'Queue',
  timestamps: true,
});

// In Queue.ts
export default Queue;
