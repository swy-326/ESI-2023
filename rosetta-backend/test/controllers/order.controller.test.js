const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const OrderController = require('../../src/controllers/order.controller');

jest.mock('@prisma/client');

describe('Order Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an order by id', async () => {
        const id = 1;
        const mockOrder = { id: 1, product: 'Product Name', quantity: 2 };

        prisma.order.findUnique.mockResolvedValue(mockOrder);

        const order = await OrderController(id);

        expect(order).toEqual(mockOrder);
        expect(prisma.order.findUnique).toHaveBeenCalledWith({
            where: {
                id
            }
        });
    });

    it('should return null if no order is found', async () => {
        const id = 999;

        prisma.order.findUnique.mockResolvedValue(null);

        const order = await OrderController(id);

        expect(order).toBeNull();
        expect(prisma.order.findUnique).toHaveBeenCalledWith({
            where: {
                id
            }
        });
    });
});