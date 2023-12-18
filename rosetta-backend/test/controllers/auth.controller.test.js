const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const AuthController = require('../../src/controllers/auth.controller');

jest.mock('@prisma/client');

describe('Auth Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully log in a user with valid email and password', async() => {
        const fastify = {
            bcrypt: {
                compare: jest.fn().mockResolvedValue(true)
            },
            jwt: {
                sign: jest.fn().mockReturnValue('token')
            }
        }

        const request = {
            body: {
                email: 'test@example.com',
                password: 'password'
            }
        }

        const response = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        }

        const prisma = {
            users: {
                findFirst: jest.fn().mockResolvedValue({
                    id: 1,
                    email: 'test@example.com',
                    password: 'hashed_password'
                })
            }
        }

        const authController = AuthController(fastify)
        await authController.handleLogin(request, response)

        expect(prisma.users.findFirst).toHaveBeenCalledWith({
            where: {
                email: 'test@example.com'
            }
        })

        expect(fastify.bcrypt.compare).toHaveBeenCalledWith('password', 'hashed_password')

        expect(fastify.jwt.sign).toHaveBeenCalledWith({
            id: 1,
            email: 'test@example.com'
        })

        expect(response.code).toHaveBeenCalledWith(200)
        expect(response.send).toHaveBeenCalledWith({
            token: 'token'
        })
    });

    it('should return a JWT token upon successful login', async() => {
        const fastify = {
            bcrypt: {
                compare: jest.fn().mockResolvedValue(true)
            },
            jwt: {
                sign: jest.fn().mockReturnValue('token')
            }
        }

        const request = {
            body: {
                email: 'test@example.com',
                password: 'password'
            }
        }

        const response = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        }

        const prisma = {
            users: {
                findFirst: jest.fn().mockResolvedValue({
                    id: 1,
                    email: 'test@example.com',
                    password: 'hashed_password'
                })
            }
        }

        const authController = AuthController(fastify)
        await authController.handleLogin(request, response)

        expect(fastify.jwt.sign).toHaveBeenCalledWith({
            id: 1,
            email: 'test@example.com'
        })

        expect(response.code).toHaveBeenCalledWith(200)
        expect(response.send).toHaveBeenCalledWith({
            token: 'token'
        })
    });

    it('should return a 404 error if user is not found', async() => {
        const fastify = {
            bcrypt: {
                compare: jest.fn().mockResolvedValue(true)
            },
            jwt: {
                sign: jest.fn().mockReturnValue('token')
            }
        }

        const request = {
            body: {
                email: 'test@example.com',
                password: 'password'
            }
        }

        const response = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        }

        const prisma = {
            users: {
                findFirst: jest.fn().mockResolvedValue(null)
            }
        }

        const authController = AuthController(fastify)
        await authController.handleLogin(request, response)

        expect(prisma.users.findFirst).toHaveBeenCalledWith({
            where: {
                email: 'test@example.com'
            }
        })

        expect(response.code).toHaveBeenCalledWith(404)
        expect(response.send).toHaveBeenCalledWith({
            error: 'User Not Found'
        })
    });


});