// src/models/UserQueue.ts

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/config';

class UserQueue extends Model {
  public userId!: string;
  public queueId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

UserQueue.init({
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  queueId: {
    type: DataTypes.UUID,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'UserQueue',
  timestamps: true,  // Enable timestamps (createdAt, updatedAt)
});

export default UserQueue;
