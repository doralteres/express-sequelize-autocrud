import {afterAll, beforeAll, describe, expect, test} from 'vitest';
import supertest from 'supertest';
import {crudApp, seedDb, testDb} from '../index.js';

describe('update route', () => {
  const sequelize = testDb();
  beforeAll(async () => {
    await sequelize.sync();
    await seedDb(sequelize);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('simple update', async () => {
    const resp = await supertest(
      crudApp(sequelize, {users: {model: 'users', operations: {update: {}}}})
    )
      .put('/users/2')
      .send({username: 'updatedOne'});
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toHaveProperty('affectedRows');
    expect(resp.body.affectedRows).toBe(1);
  });

  test('simple update not-exist id', async () => {
    const resp = await supertest(
      crudApp(sequelize, {users: {model: 'users', operations: {update: {}}}})
    )
      .put('/users/888')
      .send({username: 'updatedOne'});
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toHaveProperty('affectedRows');
    expect(resp.body.affectedRows).toBe(0);
  });

  test('update with default updatable fields (not-allowed)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {users: {model: 'users', operations: {update: {}}}})
    )
      .put('/users/2')
      .send({id: 4});
    expect(resp.statusCode).toBe(400);
  });

  test('update with custom updatable fields (include not-allowed)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {update: {updatableFields: ['id']}},
        },
      })
    )
      .put('/users/2')
      .send({username: 'anotherOne', id: 4});
    expect(resp.statusCode).toBe(400);
  });

  test('update with custom updatable fields (exclude not-allowed)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {update: {updatableFields: {exclude: ['username']}}},
        },
      })
    )
      .put('/users/2')
      .send({username: 'anotherOne', id: 4});
    expect(resp.statusCode).toBe(400);
  });

  test('create with custom creatable fields (include allowed)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            update: {updatableFields: {include: ['id', 'username']}},
          },
        },
      })
    )
      .put('/users/2')
      .send({username: 'anotherOne'});
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toHaveProperty('affectedRows');
    expect(resp.body.affectedRows).toBe(1);
  });

  test('create with custom creatable fields (exclude allowed)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {update: {updatableFields: {exclude: ['birthday']}}},
        },
      })
    )
      .put('/users/2')
      .send({username: 'lastOne'});
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toHaveProperty('affectedRows');
    expect(resp.body.affectedRows).toBe(1);
  });

  test.skip('sequelize wrong config', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            update: {
              // middleware: (req, res, next) => {
              //   delete req.params;
              //   next();
              // },
              updatableFields: () => {
                throw new Error('!@#');
              },
            },
          },
        },
      })
    )
      .put('/users/443')
      .send({a: 'b'});
    expect(resp.statusCode).toBe(500);
    expect(resp.body).toHaveProperty('message');
  });
});
