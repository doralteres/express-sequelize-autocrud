/* eslint-disable @typescript-eslint/no-unused-vars */
import {Router} from 'express';
import {
  buildOptionsFromConfig,
  runCustomMiddleware,
} from '../middleware/config.js';
import {getSequelizeErrorMessage} from '../utils.js';
import {Sequelize} from 'sequelize';
import type {LoggerOptions, deleteOptions, pureModelType} from '../types.js';

const deleteRoute = (
  sequelize: Sequelize,
  model: pureModelType,
  router: Router,
  config: deleteOptions,
  logger: LoggerOptions
) =>
  router.delete(
    '/:resourceId',
    runCustomMiddleware(config.middleware),
    async (req, res) => {
      const {middleware, byField, ...sequelizeOptions} = config;
      try {
        const options = await buildOptionsFromConfig(
          sequelizeOptions,
          req,
          res
        );
        const whereField = byField || 'id';
        await sequelize.transaction(async t => {
          const data = await model.destroy({
            ...options,
            where: {[whereField]: req.params.resourceId},
            transaction: t,
          });
          res.status(201).json({affectedCount: data});
        });
      } catch (error) {
        logger.error(error);
        res.status(500).json(getSequelizeErrorMessage(error));
      }
    }
  );

export default deleteRoute;
