/* eslint-disable @typescript-eslint/no-unused-vars */
import {Router} from 'express';
import {deleteOptions, pureModelType} from '../types';
import {
  buildOptionsFromConfig,
  runCustomMiddleware,
} from '../middleware/config';
import {getSequelizeErrorMessage} from '../utils';

const deleteRoute = (
  model: pureModelType,
  router: Router,
  config: deleteOptions
) =>
  router.delete(
    '/:resourceId',
    runCustomMiddleware(config.middleware),
    async (req, res) => {
      const {middleware, ...sequelizeOptions} = config;
      try {
        const options = await buildOptionsFromConfig(
          sequelizeOptions,
          req,
          res
        );

        const data = await model.destroy({
          ...options,
          where: {id: req.params.resourceId},
        });
        res.status(201).json({affectedCount: data});
      } catch (error) {
        console.error(error);
        res.status(500).json(getSequelizeErrorMessage(error));
      }
    }
  );

export default deleteRoute;
