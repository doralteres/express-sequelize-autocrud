import express from 'express';

import initDB from './db/models/index.js';
import bodyParser from 'body-parser';
import {modelName as users} from './db/models/users.model.js';
import {modelName as tasks} from './db/models/tasks.model.js';
import sequelizeCrud from 'express-sequelize-autocrud';

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
          getList: {
            pagination: true,
            filterableFields: ['id', 'gender'],
            limit: 100,
            order: [['createdAt', 'DESC']],
          },
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
        operations: {
          getList: {filterableFields: {exclude: []}},
          custom: router => {
            router.get('/stats', (req, res) => {
              res.send('Custom stats Route!');
            });
          },
        },
      },
    })
  );

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
