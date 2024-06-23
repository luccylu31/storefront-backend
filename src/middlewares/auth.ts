import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied, token missing!' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Access denied, invalid token!' });
  }

  res.locals.user = decoded.user;
  next();
};
