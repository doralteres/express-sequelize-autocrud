import type {Sequelize} from 'sequelize';
import {Router} from 'express';
import {getPath} from './utils.js';
import buildModelRoutes from './routes/index.js';
import {sequelizeCrudConfig, sequelizeCrudOptions} from './types.js';
import {defaultLogger} from './config.js';

const sequelizeCrud = (
  sequelize: Sequelize,
  config: sequelizeCrudConfig,
  options?: sequelizeCrudOptions
) => {
  const logger = options?.logging || defaultLogger;
  const router = Router();
  logger.info('Building CRUD API routes');
  for (const basePath in config) {
    const path = getPath(basePath);
    router.use(
      path,
      buildModelRoutes(path, sequelize, config[basePath], logger)
    );
  }
  return router;
};

export default sequelizeCrud;
export * from './types.js';
