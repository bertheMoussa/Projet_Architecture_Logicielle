import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

export type MockType<T> = {
    [P in keyof T]?: jest.Mock<{}>;
  };
  
  export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
    findOne: jest.fn(entity => entity),
  }));


describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService, 
        { provide: getRepositoryToken(User),
         useFactory: repositoryMockFactory
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllusers', () => {
    it('should return an array of users', async () => {
      const expected = [
        { id: 1, firstname: 'John', lastname: 'Doe', age: 23 },
        { id: 2, firstname: 'Jane', lastname: 'Doe', age: 28 },
      ];
      jest.spyOn(service, 'getAll').mockImplementation(() => Promise.resolve(expected));
      expect(await controller.getAllusers()).toEqual(expected);
    });
  });

  describe('getbyId', () => {
    it('should return a user by ID', async () => {
      const userId = 1;
      const expected = { id: userId, firstname: 'John', lastname: 'Doe', age: 23 };
      jest.spyOn(service, 'getbyId').mockImplementation(() => Promise.resolve(expected));
      expect(await controller.getbyId(userId.toString())).toEqual(expected);
    });

    it('should throw a 404 error when user is not found', async () => {
      const userId = 999; // An ID that doesn't exist
      jest.spyOn(service, 'getbyId').mockImplementation(() => Promise.resolve(undefined));

      try {
        await controller.getbyId(userId.toString());
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe(`User with ID ${userId} not found.`);
      }
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userInput = { firstname: 'New', lastname: 'User', age: 30 };
      const expected = { id: 3, ...userInput };
      jest.spyOn(service, 'create').mockImplementation(() => Promise.resolve(expected));
      expect(await controller.create(userInput)).toEqual(expected);
    });
  });

  describe('updatebyId', () => {
    it('should update a user by ID', async () => {
      const userId = 1;
      const userInput = { firstname: 'Updated', lastname: 'User', age: 25 };
      const expected = { id: userId, ...userInput };
      jest.spyOn(service, 'updatebyId').mockImplementation(() => Promise.resolve(expected));
      expect(await controller.updatebyId(userId.toString(), userInput)).toEqual(expected);
    });

    it('should throw a 404 error when user is not found', async () => {
      const userId = 999; // An ID that doesn't exist
      const userInput = { firstname: 'Updated', lastname: 'User', age: 25 };
      jest.spyOn(service, 'updatebyId').mockImplementation(() => Promise.resolve(undefined));

      try {
        await controller.updatebyId(userId.toString(), userInput);
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe(`User with ID ${userId} not found.`);
      }
    });
  });

  describe('deletebyId', () => {
    it('should delete a user by ID', async () => {
      const userId = 1;
      jest.spyOn(service, 'deletebyId').mockImplementation(() => Promise.resolve({ affected: 1 } as DeleteResult));
      await controller.deletebyId(userId.toString());
      expect(service.deletebyId).toHaveBeenCalledWith(userId);
    });

    it('should throw a 404 error when user is not found', async () => {
      const userId = 999; // An ID that doesn't exist
      jest.spyOn(service, 'deletebyId').mockImplementation(() => Promise.resolve(undefined));

      try {
        await controller.deletebyId(userId.toString());
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe(`User with ID ${userId} not found.`);
      }
    });
  });
});