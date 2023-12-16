/* eslint-disable @typescript-eslint/no-unused-vars */
import {Router} from 'express';
import {
  buildOptionsFromConfig,
  runCustomMiddleware,
} from '../middleware/config.js';
import {
  buildOptionsFromQueryParams,
  checkFilterableFields,
  checkSortableFields,
  setContentRange,
} from '../middleware/query.js';
import {getSequelizeErrorMessage} from '../utils.js';

import type {LoggerOptions, getListOptions, pureModelType} from '../types.js';

const getListRoute = (
  model: pureModelType,
  router: Router,
  config: getListOptions,
  logger: LoggerOptions
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
        const queryOptions = buildOptionsFromQueryParams(req.query, options);
        if (pagination) {
          const {rows, count} = await model.findAndCountAll({
            ...options,
            ...queryOptions,
            where: {...options.where, ...queryOptions.where},
          });
          setContentRange(
            res,
            model.name,
            queryOptions.offset || 0,
            rows.length,
            count
          );
          res.json(rows);
        } else {
          const data = await model.findAll({
            ...options,
            ...queryOptions,
            where: {...options.where, ...queryOptions.where},
          });
          res.json(data);
        }
      } catch (error) {
        logger.error(error);
        res.status(500).json(getSequelizeErrorMessage(error));
      }
    }
  );

export default getListRoute;
