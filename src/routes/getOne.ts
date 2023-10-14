import {Router} from 'express';
import {LoggerOptions, getOneOptions, pureModelType} from '../types';
import {
  buildOptionsFromConfig,
  runCustomMiddleware,
} from '../middleware/config';
import {getSequelizeErrorMessage} from '../utils';

const getOneRoute = (
  model: pureModelType,
  router: Router,
  config: getOneOptions,
  logger: LoggerOptions
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
        if (data) {
          res.json(data);
        } else {
          res.sendStatus(404);
        }
      } catch (error) {
        logger.error(error);
        res.status(500).json(getSequelizeErrorMessage(error));
      }
    }
  );

export default getOneRoute;
