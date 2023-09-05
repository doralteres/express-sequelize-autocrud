/* eslint-disable @typescript-eslint/no-unused-vars */
import {Router} from 'express';
import {getListOptions, getOneOptions, pureModelType} from '../types';
import {buildOptionsFromConfig} from '../middleware/config';

const getOneRoute = (
  model: pureModelType,
  router: Router,
  config: getOneOptions
) =>
  router.get('/:resourceId', async (req, res) => {
    const {middleware, ...sequelizeOptions} = config;
    try {
      const options = await buildOptionsFromConfig(sequelizeOptions, req, res);

      const data = await model.findByPk(req.params.resourceId, {
        ...options,
      });
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });

export default getOneRoute;
