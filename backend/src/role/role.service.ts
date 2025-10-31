// roles.service.ts
import { Injectable, HttpException, HttpStatus, forwardRef, Inject } from '@nestjs/common';
import { Role } from './role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, Equal } from 'typeorm';
import { RoleInput } from './role.input';
import { RoleUpdate } from './role.update';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private repository: Repository<Role>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async getAll(): Promise<Role[]> {
    return await this.repository.find();
  }

  async getById(userId: number, associationId: number): Promise<Role> {
    return await this.repository.findOne({ where: { userId : Equal(userId), associationId : Equal(associationId) } });
  }

  async create(name:string, idUser:number, idAssociation: number): Promise<Role> {
    
    const existingRole = await this.repository.findOne({ where: { name, userId: idUser, associationId: idAssociation } });
  
    if (existingRole) {
      throw new HttpException('Role already exists', HttpStatus.CONFLICT);
    }
  
    const role = this.repository.create({ name, userId: idUser, associationId: idAssociation });
    await this.repository.save(role);
    return role;
  }
  

  async update(userId: number, associationId: number, roleUpdate: RoleUpdate): Promise<Role> {
    const role = await this.getById(userId, associationId);
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }

    role.name = roleUpdate.name || role.name;

    return await this.repository.save(role);
  }

  async delete(userId: number, associationId: number): Promise<DeleteResult> {
    return await this.repository.delete({ userId, associationId });
  }

  async getUserRoles(userId: number): Promise<Role[]> {
    return await this.repository.find({ where: { userId } });
  }


  async getUsersByRoleName(roleName: string): Promise<User[]> {
  try {
    const roles = await this.repository.find({
      where: { name: roleName },
    });

    const users: User[] = [];

    for (const role of roles) {
      const user = await this.userService.getbyId(role.userId);
      if (user) {
        users.push(user);
      }
    }

    return users;
  } catch (error) {
    throw new HttpException(
      'Error while fetching users by role.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
  
}
