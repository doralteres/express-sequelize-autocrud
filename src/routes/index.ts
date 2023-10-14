import {Router} from 'express';
import {LoggerOptions, sequelizeCrudConfigModel} from '../types';
import {getModel} from '../utils';
import {Sequelize} from 'sequelize';

import getListRoute from './getList';
import getOneRoute from './getOne';
import createRoute from './create';
import updateRoute from './update';
import deleteRoute from './delete';

const buildModelRoutes = (
  path: string,
  sequelize: Sequelize,
  config: sequelizeCrudConfigModel,
  logger: LoggerOptions
) => {
  const router = Router();
  const {model: m, operations} = config;

  const model = getModel(sequelize, m);
  logger.info(`Building Model [${model.name}]`);
  if (operations.getList) {
    getListRoute(model, router, operations.getList, logger);
    logger.info(['GET', path, '[getList]'].join(' '));
  }
  if (operations.getOne) {
    getOneRoute(model, router, operations.getOne, logger);
    logger.info(['GET', `${path}/:resourceId`, '[getOne]'].join(' '));
  }
  if (operations.create) {
    createRoute(sequelize, model, router, operations.create, logger);
    logger.info(['POST', path, '[create]'].join(' '));
  }
  if (operations.update) {
    updateRoute(sequelize, model, router, operations.update, logger);
    logger.info(['PUT', `${path}/:resourceId`, '[update]'].join(' '));
  }
  if (operations.delete) {
    deleteRoute(sequelize, model, router, operations.delete, logger);
    logger.info(['DELETE', `${path}/:resourceId`, '[delete]'].join(' '));
  }
  if (operations.custom) {
    logger.warn(['WARNNING', 'Custom Routes enabled on', path].join(' '));
    operations.custom(router);
  }
  return router;
};

export default buildModelRoutes;
