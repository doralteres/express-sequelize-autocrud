import {Router} from 'express';
import {sequelizeCrudConfigModel} from '../types';
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
  config: sequelizeCrudConfigModel
) => {
  const router = Router();
  const {model: m, operations} = config;

  const model = getModel(sequelize, m);
  console.group(`Model [${model.name}]`);
  if (operations.getList) {
    getListRoute(model, router, operations.getList);
    console.log('GET', path, '[getList]');
  }
  if (operations.getOne) {
    getOneRoute(model, router, operations.getOne);
    console.log('GET', `${path}/:resourceId`, '[getOne]');
  }
  if (operations.create) {
    createRoute(sequelize, model, router, operations.create);
    console.log('POST', path, '[create]');
  }
  if (operations.update) {
    updateRoute(sequelize, model, router, operations.update);
    console.log('PUT', `${path}/:resourceId`, '[update]');
  }
  if (operations.delete) {
    deleteRoute(sequelize, model, router, operations.delete);
    console.log('DELETE', `${path}/:resourceId`, '[delete]');
  }
  if (operations.custom) {
    console.warn('WARNNING', 'Custom Routes enabled on', path);
    operations.custom(router);
  }
  console.groupEnd();
  return router;
};

export default buildModelRoutes;
