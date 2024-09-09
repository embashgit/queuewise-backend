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
    references: {
      model: 'Users', // Make sure this matches your User model's table name
      key: 'id',
    },
  },
  queueId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Queues', // Make sure this matches your Queue model's table name
      key: 'id',
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'UserQueue',
  timestamps: true,  // Enable createdAt and updatedAt timestamps
});

export default UserQueue;
