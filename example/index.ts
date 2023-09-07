import express from 'express';

import initDB from './db/models';
import bodyParser from 'body-parser';
import sequelizeCrud from 'express-sequelize-autocrud';
import {modelName as users} from './db/models/users.model';
import {modelName as tasks} from './db/models/tasks.model';

const app = express();

const port = 3000;

initDB().then(sequelize => {
  app.set('db', sequelize);
  app.use(bodyParser.json());

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.use(
    '/api',
    sequelizeCrud(sequelize, {
      users: {
        model: users,
        operations: {
          getList: {filterableFields: ['id', 'gender'], limit: 100},
          getOne: {attributes: ['id', 'fullName']},
          create: {
            creatableFields: {exclude: ['id']},
          },
          update: {
            updatableFields: {exclude: ['id']},
          },
          delete: {
            middleware: (req, res, next) => {
              if (req.query.role === 'admin') {
                next();
              } else {
                res.sendStatus(403);
              }
            },
          },
        },
      },
      tasks: {
        model: tasks,
        operations: {getList: {filterableFields: {exclude: []}}},
      },
    })
  );

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
