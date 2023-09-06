import express from 'express';

import initDB from './db/models';
import bodyParser from 'body-parser';
import sequelizeCrud from 'express-sequelize-autocrud';
import {modelName} from './db/models/users.model';

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
        model: modelName,
        operations: {
          getList: {filterableFields: ['id', 'gender'], limit: 100},
          getOne: {attributes: ['id', 'fullName']},
          create: {
            middleware: (req, res, next) => {
              if (!req.query.auth) {
                res.status(400).send('auth query is required');
              } else {
                next();
              }
            },
            creatableFields: {exclude: ['id']},
          },
        },
      },
    })
  );

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
