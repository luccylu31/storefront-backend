import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

export const generateToken = (user: {
  id: number;
  username: string;
}): string => {
  return jwt.sign({ user }, TOKEN_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (
  token: string,
): { user: { id: number; username: string } } | null => {
  try {
    return jwt.verify(token, TOKEN_SECRET) as {
      user: { id: number; username: string };
    };
  } catch (err) {
    return null;
  }
};
