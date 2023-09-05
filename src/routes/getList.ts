/* eslint-disable @typescript-eslint/no-unused-vars */
import {Router} from 'express';
import {getListOptions, pureModelType} from '../types';
import {
  buildOptionsFromConfig,
  runCustomMiddleware,
} from '../middleware/config';
import {
  buildOptionsFromQueryParams,
  checkFilterableFields,
  checkSortableFields,
} from '../middleware/query';

const getListRoute = (
  model: pureModelType,
  router: Router,
  config: getListOptions
) =>
  router.get(
    '/',
    runCustomMiddleware(config.middleware),
    checkFilterableFields(config.filterableFields),
    checkSortableFields(config.sortableFields),
    async (req, res) => {
      const {
        pagination,
        middleware,
        filterableFields,
        sortableFields,
        ...sequelizeOptions
      } = config;
      try {
        const options = await buildOptionsFromConfig(
          sequelizeOptions,
          req,
          res
        );
        const queryOptions = buildOptionsFromQueryParams(req.query);
        if (pagination) {
          const {rows, count} = await model.findAndCountAll({
            ...options,
            ...queryOptions,
            where: {...options.where, ...queryOptions.where},
          });
          // TODO: set PAGINATION
          res.json({rows, count});
        } else {
          const data = await model.findAll({
            ...options,
            ...queryOptions,
            where: {...options.where, ...queryOptions.where},
          });
          res.json(data);
        }
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
    }
  );

export default getListRoute;
