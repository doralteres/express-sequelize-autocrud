# Express Sequelize AutoCRUD

Express Sequelize AutoCRUD is a powerful and developer-friendly TypeScript library designed to simplify the creation of CRUD (Create, Read, Update, Delete) routes for your Sequelize models in an Express.js application. If you're building RESTful APIs with Express and using Sequelize as your ORM, this library will save you significant development time and effort.

![npm](https://img.shields.io/npm/v/express-sequelize-autocrud)
![NPM](https://img.shields.io/npm/l/express-sequelize-autocrud)
![GitHub issues](https://img.shields.io/github/issues/doralteres/express-sequelize-autocrud)
[![CI-Main](https://github.com/doralteres/express-sequelize-crud/actions/workflows/release.yaml/badge.svg)](https://github.com/doralteres/express-sequelize-crud/actions/workflows/release.yaml)
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

### ⚠️ Disclaimer: Development Mode ⚠️

**Please note that the Express Sequelize AutoCRUD is currently in development mode and should not be used in a production environment.**

This tool is actively being developed and may undergo significant changes, including features, code structure, and APIs. While we encourage you to explore and test it, we strongly advise against using it in a production setting at this time.

Feel free to provide feedback, report issues, or contribute to the development efforts. Your input will be valuable in shaping the tool's stability and usability as it progresses.

Thank you for your understanding and patience as we work towards making this CLI production-ready.

---

## Features

- **Automatic CRUD Operations:** Easily generate CRUD endpoints for your Sequelize models with just a few lines of code.
- **Customizable Routes:** Configure routes according to your project's specific requirements.
- **Validation and Error Handling:** Built-in request validation and error handling for seamless API development.
- **Middleware Support:** Integrate custom middleware functions with generated routes to extend functionality.
- **Transaction Support:** Create, Update and Delete routes runs inside [sequelize transaction](https://sequelize.org/docs/v6/other-topics/transactions/) to handle pre/post hooks and rollback automatically in case something failed in the process.
- **Secure and Efficient:** Utilizes Sequelize's robust security features and optimized database queries.

## Installation

Using npm:

```bash
npm i express-sequelize-autocrud
```

Using yarn:

```bash
yarn add express-sequelize-autocrud
```

Using pnpm:

```bash
pnpm i express-sequelize-autocrud
```

## Usage

Using Express Sequelize AutoCRUD is straightforward:

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
          filterableFields: ['id', 'gender'],
          attributes: ['id', 'fullName', 'gender'],
          limit: 100,
        },
        getOne: {
          attributes: req =>
            req.user.role === 'admin'
              ? ['id', 'fullName', 'secretStuf']
              : ['id', 'fullName'],
        },
        create: {
          creatableFields: {exclude: ['id']},
        },
        update: {
          updatableFields: {exclude: ['id']},
        },
        delete: {
          middleware: (req, res, next) => {
            if (req.user.role === 'admin') {
              next();
            } else {
              res.sendStatus(403);
            }
          },
        },
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

> Check out our [example project](./example) for more features and complex use-cases

## CRUD Routes

| Operation   | URL                                                                                                                                                                                                                       | Sequelize Operation                      | Comment                                                                                                                                                                                                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **getList** | Clean:<br>_GET_ `<API_URL>/<BASE_PATH>`<br><br>With pagination:<br>_GET_ `<API_URL>/<BASE_PATH>?_start=30&_end=60`<br><br>With sort & filters:<br>_GET_ `<API_URL>/<BASE_PATH>?_sort=createdAt&_order=DESC&gender=female` | `findAll()`<br>or<br>`findAndCountAll()` | - Enable pagination with `pagination: true` in the config.<br>- Pagination automatically adds `Content-Range` header.<br>- Can control which fields can be filterable using `filterableFields` in the config.<br>- Can control which fields can be sortable using `sortableFieldsFields` in the config. |
| **getOne**  | _GET_ `<API_URL>/<BASE_PATH>/:resourceId`                                                                                                                                                                                 | `findByPk()`                             |                                                                                                                                                                                                                                                                                                         |
| **create**  | _POST_ `<API_URL>/<BASE_PATH>`                                                                                                                                                                                            | `create()`                               | - Can control which fields can be added to body request using `creatableFields` in the config.                                                                                                                                                                                                          |
| **update**  | _PUT_ `<API_URL>/<BASE_PATH>/:resourceId`                                                                                                                                                                                 | `update()`                               | - Can control which fields can be added to body request using `updatableFields` in the config.                                                                                                                                                                                                          |
| **delete**  | _DELETE_ `<API_URL>/<BASE_PATH>/:resourceId`                                                                                                                                                                              | `destroy()`                              |                                                                                                                                                                                                                                                                                                         |

## Documentation

For detailed usage instructions, examples, and customization options, please refer to our [Documentation](./DOCUMENTATION.md).

## Contributing

We welcome contributions from the open-source community! Feel free to open issues, submit pull requests, or provide feedback to help us improve this library.

## License

This project is licensed under the [MIT](./LICENSE) License.

---

With Express Sequelize AutoCRUD, streamline your API development process, reduce boilerplate code, and focus on building robust applications. Happy coding!

If you have any questions, encounter issues, or want to collaborate, please don't hesitate to get in touch with us. We appreciate your support!
