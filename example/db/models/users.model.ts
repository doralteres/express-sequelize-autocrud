import {Sequelize, DataTypes} from 'sequelize';
import {modelName as tasks} from './tasks.model.js';

export const modelName = 'users';

const Users = (sequelize: Sequelize) => {
  return sequelize.define(
    modelName,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          max: 20,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.STRING,
        validate: {
          isIn: [['male', 'female', 'n/a']],
        },
      },
      locale: {
        type: DataTypes.STRING,
      },
    },
    {
      hooks: {
        afterCreate: async (attributes, options) => {
          await sequelize.model(tasks).create(
            {
              description: 'First Task',
              userId: attributes.getDataValue('id'),
            },
            {transaction: options.transaction}
          );
        },
      },
    }
  );
};

export default Users;
