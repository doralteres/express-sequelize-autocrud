import {afterAll, beforeAll, describe, expect, test} from 'vitest';
import supertest from 'supertest';
import {crudApp, seedDb, testDb} from '../index.js';

describe('bulk create route', () => {
  const sequelize = testDb();
  beforeAll(async () => {
    await sequelize.sync();
    await seedDb(sequelize);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('simple bulk create', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {model: 'users', operations: {bulkCreate: {}}},
      })
    )
      .post('/users/bulk')
      .send([{username: 'newOne'}, {username: 'anotherOne'}]);
    expect(resp.statusCode).toBe(201);
    expect(resp.body[0].id).toBe(3);
  });

  test('simple bulk creat (custom path)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {model: 'users', operations: {bulkCreate: {path: '/blabla'}}},
      })
    )
      .post('/users/blabla')
      .send([{username: 'newOne1'}, {username: 'anotherOne1'}]);
    expect(resp.statusCode).toBe(201);
    expect(resp.body[0].username).toBe('newOne1');
  });

  test('bulk create with default creatable fields (not-allowed)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {model: 'users', operations: {bulkCreate: {}}},
      })
    )
      .post('/users/bulk')
      .send([{username: 'anotherOne', id: 4}]);
    expect(resp.statusCode).toBe(400);
  });

  test('bulk create with custom creatable fields (include not-allowed)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {bulkCreate: {creatableFields: ['id']}},
        },
      })
    )
      .post('/users/bulk')
      .send([{username: 'anotherOne', id: 4}]);
    expect(resp.statusCode).toBe(400);
  });

  test('bulk create with custom creatable fields (exclude not-allowed)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {bulkCreate: {creatableFields: {exclude: ['username']}}},
        },
      })
    )
      .post('/users/bulk')
      .send([{username: 'anotherOne', id: 4}]);
    expect(resp.statusCode).toBe(400);
  });

  test('bulk create with custom creatable fields (include allowed)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            bulkCreate: {creatableFields: {include: ['id', 'username']}},
          },
        },
      })
    )
      .post('/users/bulk')
      .send([{username: 'anotherOne', id: 8}]);
    expect(resp.statusCode).toBe(201);
  });

  test('bulk create with custom creatable fields (exclude allowed)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {bulkCreate: {creatableFields: {exclude: ['birthday']}}},
        },
      })
    )
      .post('/users/bulk')
      .send([{username: 'lastOne', id: 577}]);
    expect(resp.statusCode).toBe(201);
  });

  test('sequelize wrong config', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            bulkCreate: {},
          },
        },
      })
    )
      .post('/users/bulk')
      .send([{}]);
    expect(resp.statusCode).toBe(500);
    expect(resp.body).toHaveProperty('message');
  });

  test('sequelize wrong body', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            bulkCreate: {},
          },
        },
      })
    )
      .post('/users/bulk')
      .send({});
    expect(resp.statusCode).toBe(400);
    expect(resp.body).toHaveProperty('message');
  });
});
