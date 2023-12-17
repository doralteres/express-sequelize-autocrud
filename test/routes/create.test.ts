import {afterAll, beforeAll, describe, expect, test} from 'vitest';
import supertest from 'supertest';
import {crudApp, seedDb, testDb} from '../index.js';

describe('create route', () => {
  const sequelize = testDb();
  beforeAll(async () => {
    await sequelize.sync();
    await seedDb(sequelize);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('simple create', async () => {
    const resp = await supertest(
      crudApp(sequelize, {users: {model: 'users', operations: {create: {}}}})
    )
      .post('/users')
      .send({username: 'newOne'});
    expect(resp.statusCode).toBe(201);
    expect(resp.body.id).toBe(3);
  });

  test('create with default creatable fields (not-allowed)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {users: {model: 'users', operations: {create: {}}}})
    )
      .post('/users')
      .send({username: 'anotherOne', id: 4});
    expect(resp.statusCode).toBe(400);
  });

  test('create with custom creatable fields (include not-allowed)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {create: {creatableFields: ['id']}},
        },
      })
    )
      .post('/users')
      .send({username: 'anotherOne', id: 4});
    expect(resp.statusCode).toBe(400);
  });

  test('create with custom creatable fields (exclude not-allowed)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {create: {creatableFields: {exclude: ['username']}}},
        },
      })
    )
      .post('/users')
      .send({username: 'anotherOne', id: 4});
    expect(resp.statusCode).toBe(400);
  });

  test('create with custom creatable fields (include allowed)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            create: {creatableFields: {include: ['id', 'username']}},
          },
        },
      })
    )
      .post('/users')
      .send({username: 'anotherOne', id: 4});
    expect(resp.statusCode).toBe(201);
  });

  test('create with custom creatable fields (exclude allowed)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {create: {creatableFields: {exclude: ['birthday']}}},
        },
      })
    )
      .post('/users')
      .send({username: 'lastOne', id: 5});
    expect(resp.statusCode).toBe(201);
  });

  test('sequelize wrong config', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            create: {},
          },
        },
      })
    )
      .post('/users')
      .send({});
    expect(resp.statusCode).toBe(500);
    expect(resp.body).toHaveProperty('message');
  });
});
