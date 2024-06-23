import { UserStore, User } from '../user';
import bcrypt from 'bcrypt';

// Create an instance of the UserStore
const store = new UserStore();

describe('User Model', () => {
  let testUser: User;

  beforeAll(async () => {
    // Clean up users table before running tests
    await store.clear();

    // Create a test user
    testUser = await store.create({
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser',
      password: 'testpassword',
    });
  });

  afterAll(async () => {
    // Clean up users table after running tests
    //await store.clear();
  });

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have an authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });

  it('create method should add a user', async () => {
    const user: Omit<User, 'id'> = {
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe',
      password: 'password123',
    };
    const createdUser = await store.create(user);
    expect(createdUser).toEqual({
      id: createdUser.id,
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe',
      password: createdUser.password, // hashed password
    });
  });

  it('index method should return a list of users', async () => {
    const users = await store.index();
    expect(users.length).toBeGreaterThanOrEqual(1);
  });

  it('show method should return the correct user', async () => {
    const user = await store.show(testUser.id as number);
    expect(user).toEqual(testUser);
  });

  it('authenticate method should return the correct user', async () => {
    const authenticatedUser = await store.authenticate(
      'testuser',
      'testpassword',
    );
    expect(authenticatedUser).toEqual(testUser);
  });

  it('authenticate method should return null for incorrect username', async () => {
    const authenticatedUser = await store.authenticate(
      'wronguser',
      'testpassword',
    );
    expect(authenticatedUser).toBeNull();
  });

  it('authenticate method should return null for incorrect password', async () => {
    const authenticatedUser = await store.authenticate(
      'testuser',
      'wrongpassword',
    );
    expect(authenticatedUser).toBeNull();
  });
});
