/* eslint-disable @typescript-eslint/no-unused-vars */
import {Router} from 'express';
import {
  buildOptionsFromConfig,
  runCustomMiddleware,
} from '../middleware/config.js';
import {checkBodyArrayFields} from '../middleware/body.js';
import {getSequelizeErrorMessage} from '../utils.js';
import {Sequelize} from 'sequelize';
import {DEFAULT_CREATABLE_FIELDS} from '../config.js';
import type {
  LoggerOptions,
  bulkCreateOptions,
  pureModelType,
} from '../types.js';

const bulkCreateRoute = (
  sequelize: Sequelize,
  model: pureModelType,
  router: Router,
  config: bulkCreateOptions,
  logger: LoggerOptions
) =>
  router.post(
    config.path || '/bulk',
    runCustomMiddleware(config.middleware),
    checkBodyArrayFields(config.creatableFields || DEFAULT_CREATABLE_FIELDS),
    async (req, res) => {
      const {middleware, creatableFields, path, ...sequelizeOptions} = config;
      try {
        const options = await buildOptionsFromConfig(
          sequelizeOptions,
          req,
          res
        );
        await sequelize.transaction(async t => {
          const data = await model.bulkCreate(req.body, {
            ...options,
            transaction: t,
          });
          res.status(201).json(data);
        });
      } catch (error) {
        logger.error(error);
        res.status(500).json(getSequelizeErrorMessage(error));
      }
    }
  );

export default bulkCreateRoute;
