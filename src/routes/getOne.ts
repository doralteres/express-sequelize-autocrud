import {Router} from 'express';
import {getOneOptions, pureModelType} from '../types';
import {
  buildOptionsFromConfig,
  runCustomMiddleware,
} from '../middleware/config';

const getOneRoute = (
  model: pureModelType,
  router: Router,
  config: getOneOptions
) =>
  router.get(
    '/:resourceId',
    runCustomMiddleware(config.middleware),
    async (req, res) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {middleware, ...sequelizeOptions} = config;
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

export default getOneRoute;
