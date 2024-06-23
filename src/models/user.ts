// @ts-ignore
import client from '../database';
import bcrypt from 'bcrypt';

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
};

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;

export class UserStore {
  async index(): Promise<User[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=$1';
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  async create(u: User): Promise<User> {
    try {
      // @ts-ignore
      const conn = await client.connect();

      // Check if the username already exists
      const checkSql = 'SELECT * FROM users WHERE username=$1';
      const checkResult = await conn.query(checkSql, [u.username]);
      

      if (checkResult.rows.length) {
        conn.release();
        throw new Error(`Username ${u.username} is already taken`);
      }

      const sql =
      'INSERT INTO users (first_name, last_name, username, password) VALUES($1, $2, $3, $4) RETURNING *';
      const hash = bcrypt.hashSync(
      u.password + pepper,
      parseInt(saltRounds as string),
    );

      const result = await conn.query(sql, [
        u.first_name,
        u.last_name,
        u.username,
        hash,
      ]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(`Could not add new user ${u.username}. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<User> {
    try {
      const sql = 'DELETE FROM users WHERE id=$1 RETURNING *';
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const sql = 'SELECT * FROM users WHERE username=$1';
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [username]);
      if (result.rows.length) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + pepper, user.password)) {
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error(`Could not authenticate user ${username}. Error: ${err}`);
    }
  }

  async clear(): Promise<void> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'DELETE FROM users';
      await conn.query(sql);
      conn.release();
    } catch (err) {
      throw new Error(`Could not clear users. Error: ${err}`);
    }
  }

  async getRandomUserId(): Promise<number> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query('SELECT id FROM users ORDER BY RANDOM() LIMIT 1');
      conn.release();
      return result.rows[0].id;
    } catch (error) {
      throw new Error(`Error fetching random user_id: ${error}`);
    }
  }
}
