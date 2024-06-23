import { OrderStore, Order, OrderProduct } from '../order';
import { UserStore, User } from '../user';
import { ProductStore } from '../product';

const store = new OrderStore();
const user = new UserStore();
const product = new ProductStore();

describe('Order Model', () => {
  let order: Order;
  let randomUserId: number;

  beforeAll(async () => {
    randomUserId = await user.getRandomUserId();

    order = await store.create({
      user_id: randomUserId,
      status: 'active',
    });
  });

  it('should have a currentOrderByUser method', () => {
    expect(store.currentOrderByUser).toBeDefined();
  });

  it('should have a completedOrdersByUser method', () => {
    expect(store.completedOrdersByUser).toBeDefined();
  });

  it('should have an addProduct method', () => {
    expect(store.addProduct).toBeDefined();
  });

  it('addProduct method should add a product to an order', async () => {
    try {
      const randomOrderId = await store.getRandomOrderId();
      const randomProduct = await product.getRandomProductId();

      if (!randomOrderId) {
        throw new Error('No valid random order id found');
      }
      if (!randomProduct) {
        throw new Error('No valid random product id found');
      }

    
      const quantity = 10;
      const result = await store.addProduct(randomOrderId, randomProduct, quantity);

  
      const expected = {
        id: result.id,
        order_id: randomOrderId,
        product_id: randomProduct,
        quantity: quantity,
      };

      
      expect(result).toEqual(expected);
    } catch (error) {
      fail(`Failed to add product to order: ${error}`);
    }
  });

  it('currentOrderByUser method should return the current active order', async () => {
    const randomUserId = await user.getRandomUserId();
    const result = await store.currentOrderByUser(randomUserId);
    expect(result).toEqual(jasmine.objectContaining(order));
  });

  it('completedOrdersByUser method should return a list of completed orders', async () => {
    const result = await store.completedOrdersByUser(1);
    expect(result).toEqual([]);
  });

  afterAll(async () => {
   
  });
});
