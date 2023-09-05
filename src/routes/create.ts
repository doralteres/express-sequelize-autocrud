/* eslint-disable @typescript-eslint/no-unused-vars */
import {Router} from 'express';
import {createOptions, pureModelType} from '../types';
import {
  buildOptionsFromConfig,
  runCustomMiddleware,
} from '../middleware/config';
import {checkBodyFields} from '../middleware/body';

const createRoute = (
  model: pureModelType,
  router: Router,
  config: createOptions
) =>
  router.post(
    '/',
    runCustomMiddleware(config.middleware),
    checkBodyFields(config.creatableFields),
    async (req, res) => {
      const {middleware, creatableFields, ...sequelizeOptions} = config;
      try {
        const options = await buildOptionsFromConfig(
          sequelizeOptions,
          req,
          res
        );

        const data = await model.findByPk(req.params.resourceId, {
          ...options,
        });
        res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
    }
  );

export default createRoute;
