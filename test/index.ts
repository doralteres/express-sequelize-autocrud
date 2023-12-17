import express from 'express';
import sequelizeCrud, {
  type sequelizeCrudConfig,
  type sequelizeCrudOptions,
} from '../src/index.js';
import {DataTypes, Sequelize} from 'sequelize';
import {json} from 'body-parser';

export const testDb = () => {
  const sequelize = new Sequelize('sqlite::memory:', {logging: false});
  const id = {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true};
  const users = sequelize.define('users', {
    id,
    username: {type: DataTypes.STRING, allowNull: false},
    birthday: DataTypes.DATE,
  });
  const tasks = sequelize.define('tasks', {
    id,
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    description: DataTypes.STRING,
  });
  users.hasMany(tasks);
  tasks.belongsTo(users);
  return sequelize;
};

export const seedDb = async (sequelize: Sequelize) => {
  const transaction = await sequelize.transaction();
  try {
    await sequelize.model('users').bulkCreate(
      [
        {id: 1, username: 'doralteres', birthday: new Date()},
        {id: 2, username: 'aviavi', birthday: new Date()},
      ],
      {transaction}
    );
    await sequelize.model('tasks').bulkCreate(
      [
        {id: 1, userId: 1, description: 'task #1 for doralteres'},
        {id: 2, userId: 2, description: 'task #2 for aviavi'},
      ],
      {transaction}
    );
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
  }
};

const defaultOption: sequelizeCrudOptions = {
  logging: {info: () => {}, warn: () => {}, error: () => {}},
};

export const crudApp = (
  sequelize: Sequelize,
  config: sequelizeCrudConfig,
  options = defaultOption
) => {
  const app = express();
  app.use(json());
  app.use('/', sequelizeCrud(sequelize, config, options));

  return app;
};
