import {Router} from 'express';
import {sequelizeCrudConfigModel} from '../types';
import {getModel} from '../utils';
import {Sequelize} from 'sequelize';

import getListRoute from './getList';
import getOneRoute from './getOne';
import createRoute from './create';

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
    console.log('GET', `/${path}`, '[getList]');
  }
  if (operations.create) {
    createRoute(model, router, operations.create);
    console.log('POST', `/${path}`, '[create]');
  }
  if (operations.getOne) {
    getOneRoute(model, router, operations.getOne);
    console.log('GET', `/${path}/:resourceId`, '[getOne]');
  }

  console.groupEnd();
  return router;
};

export default buildModelRoutes;
