# Express Sequelize AutoCRUD - Docs

## Basic Usage

```typescript
import express from 'express';
import {Sequelize} from 'sequelize';
import sequelizeCrud from 'express-sequelize-autocrud';

const app = express();
const sequelize = new Sequelize('your_db', 'your_user', 'your_password', {
  host: 'localhost',
  dialect: 'mysql',
});

// Define your Sequelize models here

// Generate routes using express-sequelize-autocrud
app.use(
  '/api',
  sequelizeCrud(sequelize, {
    '/users': {
      model: sequelize.model('users'),
      operations: {
        getList: {
          // config goes here...
        },
        getOne: {
          // config goes here...
        },
        create: {
          // config goes here...
        },
        update: {
          // config goes here...
        },
        delete: {
          // config goes here...
        },
      },
    },
    '/tasks': {
      model: sequelize.model('tasks'),
      operations: {
        // ... set your routes...
      },
    },
  })
);

// Start your Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

## Deep Dive

### Init

`sequelizeCrud` function needs 2 parameters to build your routes:

- sequelize object.
- config json describes your models and routes.

```typescript
const routes = sequelizeCrud(sequelize: Sequelize, config: sequelizeCrudConfig)
app.use('/abc', routes)
```

### sequelizeCrudConfig

```typescript
export type sequelizeCrudConfig = {
  [basepath: string]: {
    model: modelType;
    operations: {
      getList?: getListOptions;
      getOne?: getOneOptions;
      create?: createOptions;
      update?: updateOptions;
      delete?: deleteOptions;
      custom?: customRoutesFunc;
    };
  };
};
```

- **basepath** - Base path for all the sub-crud route
- **basepath.model** - modelName(string) or sequelize model object

  | Operation   | URL                                          |
  | ----------- | -------------------------------------------- |
  | **getList** | _GET_ `<API_URL>/<BASE_PATH>`                |
  | **getOne**  | _GET_ `<API_URL>/<BASE_PATH>/:resourceId`    |
  | **create**  | _POST_ `<API_URL>/<BASE_PATH>`               |
  | **update**  | _PUT_ `<API_URL>/<BASE_PATH>/:resourceId`    |
  | **delete**  | _DELETE_ `<API_URL>/<BASE_PATH>/:resourceId` |

  In the example below _getList_ URL will be `http://localhost:3000/crud/users` (in case the api runs @ localhost:300)

  ```typescript
  const routes = sequelizeCrud(sequelize, {
    '/users': {model: 'users', operations: {getList: {}}},
  });
  app.use('/crud', routes);
  ```

### getListOptions

All the parameters below are **Optional**.
| Parameter | Type | Default value | Details |
|---------------------- |------------------------------------------------------------------------------ |--------------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **middleware** | Express Middleware function:<br>`(req, res, next) => void` | - | Middleware function that will be triggered before the sequelize operation. Check [middleware section](#middleware) |
| **pagination** | `BOOLEAN` | false | In case of true the library will run the `findAndCountAll` instead of `findAll`, add `Content-Range` header, and set _limit_ and _offset_ from query params. |
| **filterableFields** | `string[]`<br>or<br>`{ include: string[] }`<br>or<br>`{ exclude: string[] }` | [] | Which fields can be filtered (where query) from query params. |
| **sortableFields** | `string[]`<br>or<br>`{ include: string[] }`<br>or<br>`{ exclude: string[] }` | [] | Which fields can be sorted from query params. |

In addition you can add to the config ANY sequelize [findAll](https://sequelize.org/api/v6/class/src/model.js~model#static-method-findAll) or [findAndCountAll](https://sequelize.org/api/v6/class/src/model.js~model#static-method-findAndCountAll) configurations. (depends on `pagination` value).

> Each config can be set hardcoded or with [expressCrudFunction](#expresscrudfunction) for getting the value dynamically based on user request.

> In Case of pagination enabled, you can not use `group` and `offset` sequelize configs

#### query params

| query param              | expected type                            | pagination mode | sequelize config            |
| ------------------------ | ---------------------------------------- | --------------- | --------------------------- |
| `_start`                 | NUMBER                                   | true            | offset                      |
| `_end`                   | NUMBER                                   | true            | limit = (`_end` - `_start`) |
| `_sort`                  | STRING                                   | does not matter | order                       |
| `_order`                 | `DESC` \| `ASC`<br>default value: `DESC` | does not matter | order                       |
| ...rest<br>(`key=value`) | key: STRING<br>value: ANY                | does not matter | where                       |

### getOneOptions

All the parameters below are **Optional**.
| Parameter | Type | Default value | Details |
|---------------------- |------------------------------------------------------------------------------ |--------------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **middleware** | Express Middleware function:<br>`(req, res, next) => void` | - | Middleware function that will be triggered before the sequelize operation. Check [middleware section](#middleware) |
| **byField** 	| string 	| -             	| If set - will use `findOne` (default is `findByPk`) that will return the getOne results filter by a specific field. 	|


In addition you can add to the config ANY sequelize [findByPk](https://sequelize.org/api/v6/class/src/model.js~model#static-method-findByPk) configurations. (except `where`).

> Each config can be set hardcoded or with [expressCrudFunction](#expresscrudfunction) for getting the value dynamically based on user request.

### createOptions

All the parameters below are **Optional**.

| Parameter           | Type                                                                         | Default value                                  | Details                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **middleware**      | Express Middleware function:<br>`(req, res, next) => void`                   | -                                              | Middleware function that will be triggered before the sequelize operation. Check [middleware section](#middleware) |
| **creatableFields** | `string[]`<br>or<br>`{ include: string[] }`<br>or<br>`{ exclude: string[] }` | { exclude: ['id', 'createdAt', 'updatedAt'], } | Which fields can be added to request body.                                                                         |

In addition you can add to the config ANY sequelize [create](https://sequelize.org/api/v6/class/src/model.js~model#static-method-create) configurations. (except `transaction`).

> Each config can be set hardcoded or with [expressCrudFunction](#expresscrudfunction) for getting the value dynamically based on user request.

### updateOptions

All the parameters below are **Optional**.

| Parameter           | Type                                                                         | Default value                                  | Details                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **middleware**      | Express Middleware function:<br>`(req, res, next) => void`                   | -                                              | Middleware function that will be triggered before the sequelize operation. Check [middleware section](#middleware) |
| **updatableFields** | `string[]`<br>or<br>`{ include: string[] }`<br>or<br>`{ exclude: string[] }` | { exclude: ['id', 'createdAt', 'updatedAt'], } | Which fields can be added to request body.                                                                         |

In addition you can add to the config ANY sequelize [update](https://sequelize.org/api/v6/class/src/model.js~model#static-method-update) configurations. (except `transaction` and `where`).

> Each config can be set hardcoded or with [expressCrudFunction](#expresscrudfunction) for getting the value dynamically based on user request.

### deleteOptions

All the parameters below are **Optional**.
| Parameter | Type | Default value | Details |
|---------------------- |------------------------------------------------------------------------------ |--------------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **middleware** | Express Middleware function:<br>`(req, res, next) => void` | - | Middleware function that will be triggered before the sequelize operation. Check [middleware section](#middleware) |

In addition you can add to the config ANY sequelize [destroy](https://sequelize.org/api/v6/class/src/model.js~model#static-method-destroy) configurations. (except `transaction` and `where`).

> Each config can be set hardcoded or with [expressCrudFunction](#expresscrudfunction) for getting the value dynamically based on user request.

## middleware

You can trigger a custom middleware function before trigger the actual sequelize operation.
Great for checking permissions before perform the request.
Check out the example below and read more about [express middleware](https://expressjs.com/en/guide/using-middleware.html):

```typescript
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.sendStatus(401);
  }
};

const routes = sequelizeCrud(sequelize, {
  '/users': {
    model: sequelize.model('users'),
    operations: {
      getList: {},
      getOne: {},
      create: {middleware: isAdmin},
      update: {middleware: isAdmin},
      delete: {middleware: isAdmin},
    },
  },
});
```

## expressCrudFunction

Each crud / sequelize option can be set hard-coded on using custom middleware function that should return the final value.
Check out the example below:

```typescript
const routes = sequelizeCrud(sequelize, {
  '/users': {
    model: sequelize.model('users'),
    operations: {
      getList: {
        pagination: true,
        // hard-coded value
        attributes: ['id', 'name', 'email'],
        // dynamic value using expressCrudFunction
        where: req =>
          req.user && req.user.role === 'admin' ? {} : {active: true},
      },
      create: {
        // hard-coded value
        creatableFields: {exclude: ['id', 'credits']},
      },
      update: {
        // dynamic value using expressCrudFunction
        updatableFields: req =>
          req.user && req.user.role === 'admin'
            ? {exclude: []}
            : {exclude: ['id', 'credits']},
      },
    },
  },
});
```

## Custom routes

We've added an option to set custom routes to CRUD routes in case you want to extends the options the module provided.

exapmle:

```typescript
const routes = sequelizeCrud(sequelize, {
  '/tasks': {
    model: sequelize.model('tasts'),
    operations: {
      getList: {filterableFields: {exclude: []}},
      custom: router => {
        // Add your custom routes here
        router.get('/stats', (req, res) => {
          res.send('Custom stats Route!');
        });
      },
    },
  },
});
```

In that example GET `<BASE_URL>/tasks/stats` will return `'Custom stats Route!'` message.

> ⚠️ Warnnings <br /> - All CRUD fetures does not support custom routes (middleware, crudFunctions etc.) you build your own routes from scratch!<br />- Use custom route with **different paths** so CRUD routes will not be overriden.

## transactions

Create, Update and Delete operations are automatically use sequelize [transaction](https://sequelize.org/docs/v6/other-topics/transactions/). If you have post hooks it is highly recommended to add the transaction in your hooks as well. If you will do that sequelize will roll back automatically in case something will fail in the process.
Check out the example below:

```typescript
// models/users.ts

import {Sequelize, DataTypes} from 'sequelize';
import {modelName as tasks} from './tasks.model';

export const modelName = 'users';

const Users = (sequelize: Sequelize) => {
  return sequelize.define(
    modelName,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          max: 20,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
    },
    {
      hooks: {
        afterCreate: async (attributes, options) => {
          await sequelize.model(tasks).create(
            {
              description: 'First Task',
              userId: attributes.getDataValue('id'),
            },
            // add the transaction for connect between create user and first task.
            {transaction: options.transaction}
          );
        },
      },
    }
  );
};

export default Users;
```

## Logging

By default, Auto CRUD prints logs using js console library. You can seyour own logger if you want, check out the example bellow:

```typescript
import express from 'express';
import sequelizeCrud from 'express-sequelize-autocrud';
import {createLogger, format, transports} from 'winston';
import {sequelize} from './db/models';

// Create a Winston logger
export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [new transports.Console()],
  format: format.combine(format.timestamp(), format.json()),
});

const app = express();

app.use(
  '/api',
  sequelizeCrud(
    sequelize,
    {
      '/users': {
        model: sequelize.model('users'),
        operations: {
          getList: {},
          getOne: {},
          create: {},
          update: {},
          delete: {},
        },
      },
    }, // OPTIONAL: Adding custom logger
    {
      logging: {
        info: msg => logger.info(msg), // Defualt: console.log
        warn: msg => logger.warn(msg), // Defualt: console.warn
        error: msg => logger.error(msg), // Defualt: console.error
      },
    }
  )
);
```
