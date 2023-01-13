const supertest = require('supertest');
const app = require('../app');
const userHelper = require('../utils/users_helper')
const User = require('../models/user');

const api = supertest(app)

describe('POST /users', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('should return 400 if username or password is missing', async () => {
    const res = await api
      .post('/api/users')
      .send({ username: 'testuser' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Username and password are required' });
  });

  test('should return 400 if username or password is less than 3 characters', async () => {
    const res = await api
      .post('/api/users')
      .send({ username: 'te', password: '12' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Username and password must be at least 3 characters' });
  });

  test('should return 400 if username is already taken', async () => {
    await User.create({username: 'testuser', password: 'testpassword' });
    const res = await api
      .post('/api/users')
      .send({ username: 'testuser', password: 'testpassword' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Username is already taken' });
  });

  test('should return 201 and create new user if validation passed', async () => {
    const res = await api
      .post('/api/users')
      .send({ username: 'testuser', password: 'testpassword' });
    expect(res.status).toBe(201);
    const newUser = await User.findOne({username: 'testuser'});
    expect(newUser).toBeTruthy();
  });

});


describe('GET /users', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });
    
    test('should return a list with all users and status code 200', async() => {
        const users = userHelper.initialUsers.map(user => new User(user))
        const promiseArray = users.map(user => user.save())
        await Promise.all(promiseArray)

        const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(2);
    })

})