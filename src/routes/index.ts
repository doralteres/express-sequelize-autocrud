import {Router} from 'express';
import {getModel} from '../utils.js';
import {Sequelize} from 'sequelize';

import getListRoute from './getList.js';
import getOneRoute from './getOne.js';
import createRoute from './create.js';
import updateRoute from './update.js';
import deleteRoute from './delete.js';

import type {LoggerOptions, sequelizeCrudConfigModel} from '../types.js';

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
