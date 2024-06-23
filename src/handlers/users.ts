import express, { Request, Response } from 'express';
import { UserStore, User } from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { verifyAuthToken } from '../middlewares/auth';

dotenv.config();

const store = new UserStore();
const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

const generateToken = (user: User): string => {
  return jwt.sign({ user }, TOKEN_SECRET, { expiresIn: '1h' });
};

const login = async (req: Request, res: Response) => {
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
};

const signup = async (req: Request, res: Response) => {
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
};

const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const user = await store.show(parseInt(req.params.id));
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const create = async (req: Request, res: Response) => {
  const user: User = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    password: req.body.password,
  };

  try {
    const newUser = await store.create(user);
    const token = jwt.sign(
      { user: newUser },
      process.env.TOKEN_SECRET as string,
    );
    res.json(token);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const authenticate = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await store.authenticate(username, password);
    if (user) {
      const token = jwt.sign({ user }, process.env.TOKEN_SECRET as string);
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const userRoutes = (app: express.Application) => {
  app.post('/login', login);
  app.post('/signup', signup);
  // Protect other routes
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', create);
  app.post('/users/authenticate', authenticate);
  
};

export default userRoutes;
