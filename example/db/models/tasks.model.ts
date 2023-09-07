import {Sequelize, DataTypes} from 'sequelize';
import {modelName as users} from './users.model';

export const modelName = 'tasks';

const Tasks = (sequelize: Sequelize) => {
  return sequelize.define(modelName, {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: users,
        key: 'id',
      },
    },
  });
};

export default Tasks;
