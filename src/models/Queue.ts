import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/config';

class Queue extends Model {
  public id!: string;
  public eventType!: string;
  public queueLength!: number;
  public estimatedWaitTime!: number;
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
  queueLength: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  estimatedWaitTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Queue',
  timestamps: true,
});

export default Queue;
