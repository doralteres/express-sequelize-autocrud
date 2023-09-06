/* eslint-disable @typescript-eslint/no-unused-vars */
import {Router} from 'express';
import {updateOptions, pureModelType} from '../types';
import {
  buildOptionsFromConfig,
  runCustomMiddleware,
} from '../middleware/config';
import {checkBodyFields} from '../middleware/body';
import {getSequelizeErrorMessage} from '../utils';

const updateRoute = (
  model: pureModelType,
  router: Router,
  config: updateOptions
) =>
  router.put(
    '/:resourceId',
    runCustomMiddleware(config.middleware),
    checkBodyFields(config.updatableFields),
    async (req, res) => {
      const {middleware, updatableFields, ...sequelizeOptions} = config;
      try {
        const options = await buildOptionsFromConfig(
          sequelizeOptions,
          req,
          res
        );

        const data = await model.update(req.body, {
          ...options,
          where: {id: req.params.resourceId},
          returning: true,
        });
        res.status(201).json({affectedCount: data[0], affectedRows: data[1]});
      } catch (error) {
        console.error(error);
        res.status(500).json(getSequelizeErrorMessage(error));
      }
    }
  );

export default updateRoute;
