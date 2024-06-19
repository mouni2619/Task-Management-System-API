const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Task = require('../src/models/Task');
const User = require('../src/models/User');

let token;
let taskId;

beforeAll(async () => {
  // Connect to the test database
  const dbUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/taskmanagement_test';
  await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

  // Register and log in a test user to get a JWT token
  const testUser = { username: 'taskuser', password: 'taskpassword' };
  await request(app).post('/api/auth/register').send(testUser);
  const res = await request(app).post('/api/auth/login').send(testUser);
  token = res.body.token;
});

afterAll(async () => {

  await mongoose.disconnect();
});

describe('Task API', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('x-auth-token', token)
      .send({
        title: 'Test Task',
        description: 'Test Description',
        dueDate: '2024-06-30',
        priority: 'High',
        status: 'Pending'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Test Task');
    taskId = res.body._id;
  });

  it('should retrieve all tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('x-auth-token', token);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should retrieve a task by ID', async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('x-auth-token', token);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Test Task');
  });

  it('should update an existing task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('x-auth-token', token)
      .send({ title: 'Updated Test Task' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Updated Test Task');
  });

  it('should delete a task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('x-auth-token', token);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Task removed successfully');
  });

  it('should return 404 for a non-existent task', async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('x-auth-token', token);

    expect(res.statusCode).toEqual(404);
  });
  it('should return 401 for invalid task creation request', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: '' })  // Invalid payload

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should not allow unauthorized access to tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error', 'No token, authorization denied');
  });
});
