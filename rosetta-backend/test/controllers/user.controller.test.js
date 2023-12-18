const { PrismaClient } = require('@prisma/client');
const UserController = require('../../src/controllers/user.controller');

jest.mock('@prisma/client');

const prismaMock = {
    user: {
        create: jest.fn(),
    },
};

PrismaClient.mockImplementation(() => prismaMock);

describe('User Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should get profile', async () => {
        const mockUser = { id: 1, name: 'Nome Sobrenome', email: 'test@example.com' };

        const params = { id: 1 };
    
        prismaMock.user.findUnique.mockResolvedValue(mockUser);
    
        const request = {
            params: params,
        };
    
        const reply = {
            send: jest.fn(),
        };
    
        await UserController.handleGetProfile(request, reply);
    
        expect(reply.send).toHaveBeenCalledWith(mockUser);
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
            where: { id: Number(params.id) },
        });
    });

    it('should find user', async () => {
        const mockUser = { id: 1, name: 'Nome Sobrenome', email: 'test@example.com' };
    
        const params = { id: 1 };
    
        prismaMock.user.findUnique.mockResolvedValue(mockUser);
    
        const request = {
            params: params,
        };
    
        const reply = {
            send: jest.fn(),
        };
    
        await UserController.handleFindUser(request, reply);
    
        expect(reply.send).toHaveBeenCalledWith(mockUser);
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
            where: { id: Number(params.id) },
        });
    });

    it('should create a user', async () => {
        const mockUser = { id: 1, name: 'Nome Sobrenome', email: 'test@example.com', password: 'hashedPassword' };
        const userInput = { name: 'Nome Sobrenome', email: 'test@example.com', password: 'password' };
    
        prismaMock.user.create.mockResolvedValue(mockUser);
    
        const request = {
            body: userInput,
        };
    
        const reply = {
            send: jest.fn(),
        };
    
        await UserController.handleCreate(request, reply);
    
        expect(reply.send).toHaveBeenCalledWith(mockUser);
        expect(prismaMock.user.create).toHaveBeenCalledWith({
            data: userInput,
        });
    });

    it('should update user', async () => {
        const mockUser = { id: 1, name: 'Nome Sobrenome', email: 'test@example.com' };
        const updatedUser = { id: 1, name: 'Nome sobrenome', email: 'test123@example.com' };
    
        const params = { id: 1 };
        const body = { email: 'test123@example.com' };
    
        prismaMock.user.update.mockResolvedValue(updatedUser);
    
        const request = {
            params: params,
            body: body,
        };
    
        const reply = {
            send: jest.fn(),
        };
    
        await UserController.handleUpdate(request, reply);
    
        expect(reply.send).toHaveBeenCalledWith(updatedUser);
        expect(prismaMock.user.update).toHaveBeenCalledWith({
            where: { id: Number(params.id) },
            data: body,
        });
    });

    it('should add upload image', async () => {
        const mockUser = { id: 1, name: 'Nome Sobrenome', email: 'test@example.com', image: 'image.jpg' };
    
        const params = { id: 1 };
        const body = { image: 'image.jpg' };
    
        prismaMock.user.update.mockResolvedValue(mockUser);
    
        const request = {
            params: params,
            body: body,
        };
    
        const reply = {
            send: jest.fn(),
        };
    
        await UserController.handleAddUploadImage(request, reply);
    
        expect(reply.send).toHaveBeenCalledWith(mockUser);
        expect(prismaMock.user.update).toHaveBeenCalledWith({
            where: { id: Number(params.id) },
            data: body,
        });
    });

    it('should add project', async () => {
        const mockUser = { id: 1, name: 'Nome Sobrenome', email: 'test@example.com', projects: ['Project 1'] };
    
        const params = { id: 1 };
        const body = { project: 'Project 1' };
    
        prismaMock.user.update.mockResolvedValue(mockUser);
    
        const request = {
            params: params,
            body: body,
        };
    
        const reply = {
            send: jest.fn(),
        };
    
        await UserController.handleAddProject(request, reply);
    
        expect(reply.send).toHaveBeenCalledWith(mockUser);
        expect(prismaMock.user.update).toHaveBeenCalledWith({
            where: { id: Number(params.id) },
            data: {
                projects: {
                    connect: {
                        id: body.project,
                    },
                },
            },
        });
    });

});