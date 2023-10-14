/* eslint-disable @typescript-eslint/no-unused-vars */
import {Router} from 'express';
import {updateOptions, pureModelType, LoggerOptions} from '../types';
import {
  buildOptionsFromConfig,
  runCustomMiddleware,
} from '../middleware/config';
import {checkBodyFields} from '../middleware/body';
import {getSequelizeErrorMessage} from '../utils';
import {Sequelize} from 'sequelize';
import {DEFAULT_UPDATABLE_FIELDS} from '../config';

const updateRoute = (
  sequelize: Sequelize,
  model: pureModelType,
  router: Router,
  config: updateOptions,
  logger: LoggerOptions
) =>
  router.put(
    '/:resourceId',
    runCustomMiddleware(config.middleware),
    checkBodyFields(config.updatableFields || DEFAULT_UPDATABLE_FIELDS),
    async (req, res) => {
      const {middleware, updatableFields, ...sequelizeOptions} = config;
      try {
        const options = await buildOptionsFromConfig(
          sequelizeOptions,
          req,
          res
        );
        await sequelize.transaction(async t => {
          const data = await model.update(req.body, {
            ...options,
            where: {id: req.params.resourceId},
            returning: true,
            transaction: t,
          });
          res.status(201).json({affectedCount: data[0], affectedRows: data[1]});
        });
      } catch (error) {
        logger.error(error);
        res.status(500).json(getSequelizeErrorMessage(error));
      }
    }
  );

export default updateRoute;
