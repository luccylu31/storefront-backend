import request from 'supertest';
import express, { Express } from 'express';
import { UserStore, User } from '../../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

// Mocking JWT token generation for testing
const generateToken = (user: User): string => {
  return jwt.sign({ user }, TOKEN_SECRET, { expiresIn: '1h' });
};

describe('User Handler', () => {
  let app: Express;
  let createdUserId: number | undefined;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Mock UserStore for testing
    const store = new UserStore();

    // Define routes using mocked handlers
    app.post('/login', async (req, res) => {
      const { username, password } = req.body;
      try {
        const user = await store.authenticate(username, password);
        if (user) {
          const token = generateToken(user);
          res.json({ token });
        } else {
          res.status(401).json({ message: 'Invalid credentials' });
        }
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }
    });

    app.post('/signup', async (req, res) => {
      const user: User = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: req.body.password,
      };
      try {
        const newUser = await store.create(user);
        const token = generateToken(newUser);
        res.json({ token });
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    });

    app.get('/users', async (_req, res) => {
      try {
        const users = await store.index();
        res.json(users);
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    });

    app.get('/users/:id', async (req, res) => {
      try {
        const user = await store.show(parseInt(req.params.id));
        res.json(user);
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    });

    app.post('/users', async (req, res) => {
      const user: User = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: req.body.password,
      };
      try {
        const newUser = await store.create(user);
        if (newUser.id) {
          const { id, first_name, last_name, username } = newUser;
          const token = generateToken(newUser);
          res.status(200).json({ id, first_name, last_name, username, token });
        } else {
          res.status(400).json({ error: 'Failed to create user. Missing user id.' });
        }
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    });

    app.post('/users/authenticate', async (req, res) => {
      const { username, password } = req.body;

      try {
        const user = await store.authenticate(username, password);
        if (user) {
          const token = generateToken(user);
          res.json({ token });
        } else {
          res.status(401).json({ message: 'Invalid credentials' });
        }
      } catch (error) {
        res.status(500).json({ error: (error as Error).message });
      }
    });
  });

  it('should login a user with correct credentials', async () => {
    const user: User = {
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe',
      password: 'password',
    };

    // Create user for login test
    await request(app).post('/users').send(user);

    // Login with correct credentials
    const response = await request(app).post('/login').send({
      username: 'johndoe',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('should not login with incorrect credentials', async () => {
    const response = await request(app).post('/login').send({
      username: 'nonexistentuser',
      password: 'incorrectpassword',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should create a new user', async () => {
    const newUser: User = {
      first_name: 'Jane',
      last_name: 'Smith',
      username: 'janesmith',
      password: 'password',
    };

    const response = await request(app).post('/signup').send(newUser);

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    createdUserId = response.body.id;
  });

  it('should fetch all users', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1); // Assuming at least one user exists
  });

  it('should fetch a specific user by ID', async () => {
    // Create a new user
    const newUser: User = {
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe22',
      password: 'password',
    };

    const createUserResponse = await request(app).post('/users').send(newUser);

    // Fetch the user by ID
    const fetchUserResponse = await request(app).get(`/users/${createUserResponse.body.id}`);

    expect(fetchUserResponse.status).toBe(200);
    expect(fetchUserResponse.body.first_name).toEqual(newUser.first_name);
    expect(fetchUserResponse.body.last_name).toEqual(newUser.last_name);
    expect(fetchUserResponse.body.username).toEqual(newUser.username);
  });
   
  afterAll(() => {
    // Clean up if needed
  });
});
