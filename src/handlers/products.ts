import express, { Request, Response } from 'express';
import { ProductStore, Product } from '../models/product';
import { verifyAuthToken } from '../middlewares/auth';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res
      .status(400)
      .json({ error: 'An error occurred while retrieving products' });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(parseInt(req.params.id));
    res.json(product);
  } catch (err) {
    res
      .status(400)
      .json({ error: 'An error occurred while retrieving the product' });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const product: Omit<Product, 'id'> = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    };
    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    res
      .status(400)
      .json({
        error: 'An error occurred while creating the product',
        details: err,
      });
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(req.body.id);
    res.json(deleted);
  } catch (error) {
    res
      .status(400)
      .json({
        error: 'An error occurred while deleting the product',
        details: error,
      });
  }
};

const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const category = req.params.category;
    const products = await store.getProductsByCategory(category);
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
  app.delete('/products', verifyAuthToken, destroy);
  app.get('/products/category/:category', getProductsByCategory);
};

export default productRoutes;
