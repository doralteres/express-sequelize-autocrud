/* eslint-disable @typescript-eslint/no-unused-vars */
import {Router} from 'express';
import {
  buildOptionsFromConfig,
  runCustomMiddleware,
} from '../middleware/config.js';
import {checkBodyFields} from '../middleware/body.js';
import {getSequelizeErrorMessage} from '../utils.js';
import {Sequelize} from 'sequelize';
import {DEFAULT_CREATABLE_FIELDS} from '../config.js';
import type {LoggerOptions, createOptions, pureModelType} from '../types.js';

const createRoute = (
  sequelize: Sequelize,
  model: pureModelType,
  router: Router,
  config: createOptions,
  logger: LoggerOptions
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
        logger.error(error);
        res.status(500).json(getSequelizeErrorMessage(error));
      }
    }
  );

export default createRoute;
