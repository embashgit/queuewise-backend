import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/config';
import Queue from './Queue';

class User extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: string;
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user',
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  timestamps: true,
});
// In User.ts
User.belongsToMany(Queue, { through: 'UserQueue', foreignKey: 'userId' });

export default User;
