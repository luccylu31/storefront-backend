// @ts-ignore
import client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category?: string;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      conn.release();

      // @ts-ignore
      const products = result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        price: parseFloat(row.price),
        category: row.category,
      }));

      return products;

      //return result.rows;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=$1';
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();

      // @ts-ignore
      const product = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        price: parseFloat(result.rows[0].price), // Chuyển đổi từ chuỗi sang số
        category: result.rows[0].category,
      };

      return product;
      //return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`);
    }
  }

  async create(p: Omit<Product, 'id'>): Promise<Product> {
    try {
      const sql =
        'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [p.name, p.price, p.category]);
      const product = result.rows[0];
      conn.release();
      const newProduct = {
        ...product,
        id: result.rows[0].id,
        price: parseFloat(result.rows[0].price), // Convert string to number
      };

      return newProduct;
      //return product;
    } catch (err) {
      throw new Error(`Could not add new product ${p.name}. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=$1 RETURNING *';
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Could not delete product ${id}. Error: ${err}`);
    }
  }

  async topPopular(): Promise<Product[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = `
        SELECT p.*, SUM(op.quantity) as total_quantity
        FROM products p
        JOIN order_products op ON p.id = op.product_id
        GROUP BY p.id
        ORDER BY total_quantity DESC
        LIMIT 5
      `;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get top popular products. Error: ${err}`);
    }
  }

  async getRandomProductId(): Promise<number | null> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query('SELECT id FROM products ORDER BY RANDOM() LIMIT 1');
      conn.release();
      console.log('product_id check: ', result.rows[0].id);
      if (result.rows.length > 0) {
        return result.rows[0].id;
      } else {
        throw new Error('No products found');
      }
    } catch (error) {
      throw new Error(`Error fetching random product_id: ${error}`);
    }
  }

  async clear(): Promise<void> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'DELETE FROM products';
      await conn.query(sql);
      conn.release();
    } catch (err) {
      throw new Error(`Could not clear products. Error: ${err}`);
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'SELECT * FROM products WHERE category=($1)';
      const result = await conn.query(sql, [category]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not find products in category ${category}. Error: ${err}`);
    }
  }
}
