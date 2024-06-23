import { ProductStore } from '../product';
import { OrderStore } from '../order';
import { UserStore } from '../user';
import { Product } from '../product';

const store = new ProductStore();
const user = new UserStore();

const mockProduct: Product = {
  name: 'Test Product',
  price: 19.99,
  category: 'Electronics',
};

describe('Product Model', () => {
  let product: Product;

  beforeAll(async () => {
    await store.clear(); 

    try {
      await store.create(mockProduct); 
    } catch (error) {
      fail(`Failed to insert mock product: ${error}`);
    }

    product = await store.create({
      name: 'Product 1',
      price: 100,
      category: 'Category 1',
    });
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

  it('create method should add a product', async () => {
    const result = await store.create({
      name: 'Product 2',
      price: 200,
      category: 'Category 2',
    });
    expect(result).toEqual({
      id: result.id,
      name: 'Product 2',
      price: 200,
      category: 'Category 2',
    });
  });

  it('index method should return a list of products', async () => {
    const expectedProduct = {
      id: product.id,
      name: 'Product 1',
      price: 100,
      category: 'Category 1',
    };

    const result = await store.index();

    expect(result).toEqual(
      jasmine.arrayContaining([jasmine.objectContaining(expectedProduct)]),
    );
  });

  it('show method should return the correct product', async () => {
    const result = await store.show(product.id as number);
    expect(result).toEqual(product);
  });

  it('should have a topPopular method', () => {
    expect(store.topPopular).toBeDefined();
  });

  it('topPopular method should return the top 5 most popular products', async () => {
    const product1 = await store.create({ name: 'Product 1', price: 100, category: 'Category 1' });
    const product2 = await store.create({ name: 'Product 2', price: 200, category: 'Category 2' });
    const product3 = await store.create({ name: 'Product 3', price: 300, category: 'Category 3' });
    const product4 = await store.create({ name: 'Product 4', price: 400, category: 'Category 4' });
    const product5 = await store.create({ name: 'Product 5', price: 500, category: 'Category 5' });
    const product6 = await store.create({ name: 'Product 6', price: 600, category: 'Category 6' });

    const orderStore = new OrderStore();
    const randomUserId = await user.getRandomUserId();
    const order = await orderStore.create({ user_id: randomUserId, status: 'complete' });

    await orderStore.addProduct(order.id as number, product1.id as number, 10);
    await orderStore.addProduct(order.id as number, product2.id as number, 5);
    await orderStore.addProduct(order.id as number, product3.id as number, 15);
    await orderStore.addProduct(order.id as number, product4.id as number, 8);
    await orderStore.addProduct(order.id as number, product5.id as number, 7);
    await orderStore.addProduct(order.id as number, product6.id as number, 2);

    const result = await store.topPopular();
    expect(result.length).toBe(5);
    expect(result[0].name).toBe('Product 3');
    expect(result[1].name).toBe('Product 1');
    expect(result[2].name).toBe('Product 4');
    expect(result[3].name).toBe('Product 5');
    expect(result[4].name).toBe('Product 2');
  });
  
  it('getProductsByCategory method should return products of a specific category', async () => {
    const result = await store.getProductsByCategory('Category 1');
    
    const normalizedResult = result.map((p) => ({
      ...p,
      price: parseFloat(p.price as unknown as string),
    }));
    
    expect(normalizedResult).toEqual(
      jasmine.arrayContaining([
        jasmine.objectContaining({
          id: product.id,
          name: 'Product 1',
          price: 100,
          category: 'Category 1',
        }),
      ])
    );
  });

  afterAll(async () => {

  });
});
