// mockDependencies.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock Fastify
const mockFastify = {
  get: jest.fn(),
  post: jest.fn(),
  jwt:{
    sign: jest.fn(),
  },
  bcrypt:{
    compare: jest.fn(),
  },
};

jest.mock('fastify', () => {
  return jest.fn(() => mockFastify);
});

// Mock bcrypt
jest.mock('bcrypt', () => ({
    compare: jest.fn(),
    hash: jest.fn(),
}));

mockFastify.jwt.sign.mockReturnValue('mockedToken');


const mockPrisma = {
    users:{
        findFirst:  jest.fn(),
    },
}

jest.mock('prisma', () => {
    return jest.fn(() => mockPrisma)
});

jest.mock('users', () => ({
    findFirst: jest.fn(),
}));

// Mock the return value for users.findFirst
mockPrisma.users.findFirst.mockResolvedValue({
    id: 1,
    internal_id: 'internal_id_123',
    email: 'test@example.com',
    password: '$2b$10$hashedPassword',
});



module.exports = {
  mockFastify,
  mockPrisma,
};
