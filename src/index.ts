import {Sequelize} from 'sequelize';
import {Router} from 'express';
import {sequelizeCrudConfig} from './types';
import {getPath} from './utils';
import buildModelRoutes from './routes';

const sequelizeCrud = (sequelize: Sequelize, config: sequelizeCrudConfig) => {
  console.group('Building express crud routes:');
  const router = Router();
  for (const basePath in config) {
    const path = getPath(basePath);
    router.use(path, buildModelRoutes(path, sequelize, config[path]));
  }
  console.groupEnd();
};

export default sequelizeCrud;
