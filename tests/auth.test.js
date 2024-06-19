const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

const testUser = {
  username: 'user',
  password: 'user123',
  isAdmin: false // Regular user
};

const adminUser = {
  username: 'admin2',
  password: 'admin123',
  isAdmin: true // Admin user
};

let server;

beforeAll(async () => {
  const dbUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/taskmanagement_test';
  await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });


  // Start the server on a different port for testing
  const PORT = 5012; // Test server port
  server = await new Promise(resolve => {
    const instance = app.listen(PORT, () => {
      console.log(`Test server running on port ${PORT}`);
      resolve(instance);
    });
  });
});

afterAll(async () => {
  await User.deleteMany({ username: { $in: ['user', 'newadmin', 'taskuser'] } });
  await mongoose.disconnect();
  if (server) {
    server.close();
  }
});


describe('Auth API', () => {
  it('should deny access without token', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error', 'No token, authorization denied');
  });

  it('should deny access with invalid token', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('x-auth-token', 'invalidtoken');

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error', 'Token is not valid');
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not allow registration with an existing username', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'User already exists');
  });

  it('should log in an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(testUser);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not log in with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'user', password: 'wrongpassword' });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });

  it('should not log in with missing username', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'user123' });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });

  it('should not log in with missing password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'user' });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('error', 'Server error');
  });

  it('should not access protected route without token', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error', 'No token, authorization denied');
  });

  it('should not access protected route with invalid token', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', 'Bearer invalidtoken');

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error', 'No token, authorization denied');
  });

  // Admin Tests
  describe('Admin API', () => {
    it('should register a new admin user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newadmin',  // Adjust with appropriate username
          password: 'admin123',  // Adjust with appropriate password
          isAdmin: true
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');

      // Verify the role is set to admin
      const decodedToken = jwt.verify(res.body.token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken.user.id);

      // Ensure user is not null before accessing properties
      expect(user).not.toBeNull();
      expect(user.isAdmin).toEqual(true);
    });




    it('should log in the admin user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'newadmin', password: 'admin123' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not allow regular users to access admin routes', async () => {
      const userLogin = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'user',  // Adjust with your test user credentials
          password: 'user123'  // Adjust with your test user password
        });

      const res = await request(app)
        .get('/api/admin/users') // Replace with your admin-specific route
        .set('x-auth-token', userLogin.body.token);

      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('error', 'Not authorized as admin');
    });
    it('should not allow regular users to register as admin', async () => {
      const userLogin = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'user',  // Adjust with your test user credentials
          password: 'user123'  // Adjust with your test user password
        });

      const res = await request(app)
        .post('/api/auth/register')
        .set('x-auth-token', userLogin.body.token)
        .send({
          username: 'newadmin',  // Adjust with appropriate username
          password: 'admin123',  // Adjust with appropriate password
          isAdmin: true
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'User already exists');
    });

    it('should allow admin users to access admin routes', async () => {
      const adminLogin = await request(app)
        .post('/api/auth/login')
        .send({ username: 'newadmin', password: 'admin123' });

      const res = await request(app)
        .get('/api/admin/only') // Replace with your admin-specific route
        .set('x-auth-token', adminLogin.body.token);

      expect(res.statusCode).toEqual(200);
    });

    it('should not access admin route without token', async () => {
      const res = await request(app)
        .get('/api/admin/users') // Replace with your admin-specific route
        .send();

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'No token, authorization denied');
    });

    it('should not access admin route with invalid token', async () => {
      const res = await request(app)
        .get('/api/admin/users') // Replace with your admin-specific route
        .set('x-auth-token', 'invalidtoken');

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Token is not valid');
    });
  });
});
