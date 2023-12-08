const { mockFastify, mockPrismaClient } = require('./mockDependencies');

const AuthController = require('../../src/controllers/auth.controller');

describe('AuthController', () => {
  let authController;
  let fastifyMock;
  let prismaMock;
  beforeAll(() => {
    fastifyMock = mockFastify;
    prismaMock = mockPrismaClient;
    authController = AuthController(fastifyMock);
  });

  describe('handleLogin', () => {
    it('should handle login and return a token', async () => {
      // Mock the request and response objects
      const requestMock = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };
      const responseMock = {
        code: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Mock Prisma client response
      prismaMock.users.findFirst.mockResolvedValue({
        id: 1,
        internal_id: 'internal_id_123',
        email: 'test@example.com',
        password: '$2b$10$hashedPassword',
      });

      // Mock bcrypt compare
      fastifyMock.bcrypt.compare.mockResolvedValue(true);
      fastifyMock.jwt.sign.mockReturnValue('mockedToken');

      // Call the method
      const result = await authController.handleLogin(requestMock, responseMock);

      // Verify the response
      expect(responseMock.code).toHaveBeenCalledWith(200);
      expect(responseMock.send).toHaveBeenCalledWith({ token: 'mockedToken' });
      expect(result).toEqual({ token: 'mockedToken' });
    });

    it('should handle login when user is not found', async () => {
      // Mock the request and response objects
      const requestMock = {
        body: {
          email: 'nonexistent@example.com',
          password: 'password123',
        },
      };
      const responseMock = {
        code: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Mock Prisma client response for a nonexistent user
      prismaMock.users.findFirst.mockResolvedValue(null);

      // Call the method
      const result = await authController.handleLogin(requestMock, responseMock);

      // Verify the response
      expect(responseMock.code).toHaveBeenCalledWith(404);
      expect(responseMock.send).toHaveBeenCalledWith({ error: 'User Not Found' });
      expect(result).toBeUndefined();
    });

    it('should handle login when password is incorrect', async () => {
      // Mock the request and response objects
      const requestMock = {
        body: {
          email: 'test@example.com',
          password: 'incorrectPassword',
        },
      };
      const responseMock = {
        code: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Mock Prisma client response for an existing user
      prismaMock.users.findFirst.mockResolvedValue({
        id: 1,
        internal_id: 'internal_id_123',
        email: 'test@example.com',
        password: '$2b$10$hashedPassword',
      });

      // Mock bcrypt compare for incorrect password
      fastifyMock.bcrypt.compare.mockResolvedValue(false);

      // Call the method
      const result = await authController.handleLogin(requestMock, responseMock);

      // Verify the response
      expect(responseMock.code).toHaveBeenCalledWith(404);
      expect(responseMock.send).toHaveBeenCalledWith({ error: 'Wrong Password' });
      expect(result).toBeUndefined();
    });
  });
});
