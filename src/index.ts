import {Sequelize} from 'sequelize';
import {Router} from 'express';
import {getPath} from './utils';
import buildModelRoutes from './routes';
import {sequelizeCrudConfig} from './types';

const sequelizeCrud = (sequelize: Sequelize, config: sequelizeCrudConfig) => {
  console.group('Building express crud routes:');
  const router = Router();
  for (const basePath in config) {
    const path = getPath(basePath);
    router.use(path, buildModelRoutes(path, sequelize, config[basePath]));
  }
  console.groupEnd();
  return router;
};

export default sequelizeCrud;
export * from './types';
