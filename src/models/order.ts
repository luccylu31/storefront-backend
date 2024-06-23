// @ts-ignore
import client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  status: string;
};

export type OrderProduct = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders';
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id = $1';
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }

  async create(order: Order): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *';
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [order.user_id, order.status]);
      const newOrder = result.rows[0];
      conn.release();
      return newOrder;
    } catch (err) {
      throw new Error(
        `Could not add new order for user ${order.user_id}. Error: ${err}`,
      );
    }
  }

  async delete(id: number): Promise<Order> {
    try {
      const sql = 'DELETE FROM orders WHERE id = $1 RETURNING *';
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      const deletedOrder = result.rows[0];
      conn.release();
      return deletedOrder;
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    }
  }

  async currentOrderByUser(user_id: number): Promise<Order | null> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = `
        SELECT * FROM orders
        WHERE user_id = $1 AND status = 'active'
        ORDER BY id DESC
        LIMIT 1
      `;
      const result = await conn.query(sql, [user_id]);
      conn.release();

      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err) {
      console.error('Error in currentOrderByUser:', err);
      return null;
    }
  }

  async completedOrdersByUser(userId: number): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id = $1 AND status = $2';
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [userId, 'complete']);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(
        `Could not get completed orders for user ${userId}. Error: ${err}`,
      );
    }
  }

  
  async addProduct(order_id: number, product_id: number, quantity: number): Promise<OrderProduct> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [order_id, product_id, quantity]);
      const newOrderProduct = result.rows[0];
      conn.release();
      return newOrderProduct;
    } catch (err) {
      throw new Error(`Could not add product ${product_id} to order ${order_id}. Error: ${err}`);
    }
  }

  async getRandomOrderId(): Promise<number> {
    try {
       // @ts-ignore
       const conn = await client.connect();
       const result = await conn.query('SELECT id FROM orders ORDER BY RANDOM() LIMIT 1');
       conn.release();
       return result.rows[0].id;
    } catch (error) {
      throw new Error(`Error fetching random user_id: ${error}`);
    }
  }
}
