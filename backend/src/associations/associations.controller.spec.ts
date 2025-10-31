import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { AssociationsController } from './associations.controller';
import { AssociationsService } from './associations.service';
import { Association } from './association.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AssociationInput } from './association.input';


export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn(entity => entity),


}));

describe('AssociationsController', () => {
  let controller: AssociationsController;
  let service: AssociationsService;

  beforeEach(async () => {
    const module1: TestingModule = await Test.createTestingModule({
      controllers: [AssociationsController],
      providers: [
        AssociationsService,

        {
          provide: getRepositoryToken(Association),
          useFactory: repositoryMockFactory,
        },
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ]
    }).compile();

    service = module1.get<AssociationsService>(AssociationsService);
    controller = module1.get<AssociationsController>(AssociationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllassociations', () => {
    it('should return an array of associations', async () => {
      const expected: Association[] = [{ id: 1, name: 'Association 1', users: [] }];
      jest.spyOn(service, 'getAll').mockImplementation(() => Promise.resolve(expected));
      expect(await controller.getAllassociations()).toEqual(expected);
    });
  });

  /*describe('getbyId', () => {
    it('should return an association by ID', async () => {
      const associationId = 1;
      const expected = { id: associationId, name: 'Association 1', users: [] };
      jest.spyOn(service, 'getbyID').mockImplementation(() => Promise.resolve(expected));
      expect(await controller.getbyId(associationId.toString())).toEqual(expected);
    });

    it('should throw a 404 error when association is not found', async () => {
      const associationId = 999; // An ID that doesn't exist
      jest.spyOn(service, 'getbyID').mockImplementation(() => Promise.resolve(undefined));

      try {
        await controller.getbyId(associationId.toString());
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe(`Association with ID ${associationId} not found.`);
      }
    });
  });*/

  describe('create', () => {
    it('should create a new association', async () => {
      const associationInput: AssociationInput = {
        name: 'New Association', idUsers: [1, 2, 3],
        users: []
      };
      const expected = { id: 2, ...associationInput, users: [] };
      jest.spyOn(service, 'create').mockImplementation(() => Promise.resolve(expected));
      expect(await controller.create(associationInput)).toEqual(expected);
    });
  });

  describe('updatebyId', () => {
    it('should update an association by ID', async () => {
      const associationId = 1;
      const associationInput = { name: 'Updated Association', users: [] };
      const expected = { id: associationId, ...associationInput  };
      jest.spyOn(service, 'updatebyID').mockImplementation(() => Promise.resolve(expected));
      expect(await controller.updatebyId(associationId.toString(), associationInput)).toEqual(expected);
    });

    it('should throw a 404 error when association is not found', async () => {
      const associationId = 999; // An ID that doesn't exist
      const associationInput = { name: 'Updated Association', users: [] };
      jest.spyOn(service, 'updatebyID').mockImplementation(() => Promise.resolve(undefined));

      try {
        await controller.updatebyId(associationId.toString(), associationInput);
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe(`Association with ID ${associationId} not found.`);
      }
    });
  });

  describe('deletebyId', () => {
    it('should delete an association by ID', async () => {
      const associationId = 1;
      jest.spyOn(service, 'deletebyID').mockImplementation(() => Promise.resolve());
      await controller.deletebyId(associationId.toString());
      expect(service.deletebyID).toHaveBeenCalledWith(associationId);
    });

    it('should throw a 404 error when association is not found', async () => {
      const associationId = 999; // An ID that doesn't exist
      jest.spyOn(service, 'deletebyID').mockImplementation(() => Promise.resolve(undefined));

      try {
        await controller.deletebyId(associationId.toString());
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe(`Association with ID ${associationId} not found.`);
      }
    });
  });

  /*describe('getMembers', () => {
    it('should return members of an association by ID', async () => {
      const associationId = 1;
      const expected = [{ id: 1, name: 'John', lastname: 'Doe', age: 25, role: 'member'}];
      jest.spyOn(service, 'getmembers').mockImplementation(() => Promise.resolve(expected));
      expect(await controller.getMembers(associationId.toString())).toEqual(expected);
    });*/

    it('should throw a 404 error when association is not found', async () => {
      const associationId = 999; // An ID that doesn't exist
      jest.spyOn(service, 'getmembers').mockImplementation(() => Promise.resolve(undefined));

      try {
        await controller.getMembers(associationId.toString());
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe(`Association with ID ${associationId} not found.`);
      }
    });
  });

