// src/server.ts
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import productRoutes from './handlers/products';
import userRoutes from './handlers/users';
import orderRoutes from './handlers/orders';

const app: express.Application = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

productRoutes(app);
userRoutes(app);
orderRoutes(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
