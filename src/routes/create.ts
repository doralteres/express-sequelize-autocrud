/* eslint-disable @typescript-eslint/no-unused-vars */
import {Router} from 'express';
import {createOptions, pureModelType} from '../types';
import {
  buildOptionsFromConfig,
  runCustomMiddleware,
} from '../middleware/config';
import {checkBodyFields} from '../middleware/body';
import {getSequelizeErrorMessage} from '../utils';
import {Sequelize} from 'sequelize';
import {DEFAULT_CREATABLE_FIELDS} from '../config';

const createRoute = (
  sequelize: Sequelize,
  model: pureModelType,
  router: Router,
  config: createOptions
) =>
  router.post(
    '/',
    runCustomMiddleware(config.middleware),
    checkBodyFields(config.creatableFields || DEFAULT_CREATABLE_FIELDS),
    async (req, res) => {
      const {middleware, creatableFields, ...sequelizeOptions} = config;
      try {
        const options = await buildOptionsFromConfig(
          sequelizeOptions,
          req,
          res
        );
        await sequelize.transaction(async t => {
          const data = await model.create(req.body, {
            ...options,
            transaction: t,
          });
          res.status(201).json(data);
        });
      } catch (error) {
        console.error(error);
        res.status(500).json(getSequelizeErrorMessage(error));
      }
    }
  );

export default createRoute;
