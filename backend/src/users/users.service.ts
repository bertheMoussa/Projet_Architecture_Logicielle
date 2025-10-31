import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AssociationsService } from 'src/associations/associations.service';
import { RoleService } from 'src/role/role.service';
import { DeleteResult, Equal, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => RoleService))
    private roleService: RoleService,
    @InjectRepository(User)
    private repository: Repository<User>,
    @Inject(forwardRef(() => AssociationsService))
    private associationService: AssociationsService,

  ) {}

  async getAll(): Promise<User[]> {
    return await this.repository.find();
  }

  public async create(
    firstname: string,
    lastname: string,
    age: number,
    email: string,
    password: string,
  ): Promise<User> {
    const existingUser = await this.repository.findOne({
      where: { firstname, lastname },
    });
  
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
  
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  
    let user: User = await this.repository.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      age: age,
      password: hashedPassword, 
    });
  
    await this.repository.save(user);
    return user;
  }
  

  async getbyId(id: number): Promise<User> {
    return this.repository.findOne({ where: { id: Equal(id) } });
  }

  async updatebyId(
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    age: number,
    password: string,
  ): Promise<User> {
    var user = await this.repository.findOne({ where: { id: Equal(id) } });
    if (firstname !== undefined) {
      user.firstname = firstname;
    }
    if (lastname !== undefined) {
      user.lastname = lastname;
    }
    if (email !== undefined) {
      user.email = email;
    }
    if (age !== undefined) {
      user.age = age;
    }
    if (password !== undefined) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }
    return await this.repository.save(user);
  }

  async deletebyId(id: number): Promise<DeleteResult> {
    const result = await this.repository.delete(id);
    return result;
  }

  async getUserRoles(id: number): Promise<{ roleName: string }[]> {
    const user = await this.getbyId(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const roles = await this.roleService.getUserRoles(id);
    return roles.map((role) => ({ roleName: role.name }));
  }

  async getUserAssociations(id: number):Promise<String[]>{
    const associations = await this.associationService.getAll();
    const assciationnames = [];
    for (const association of associations){
      const members = await this.associationService.getmembers(association.id);
      const objectExists = members.some((member) => member.id === id);
      if (objectExists){
        assciationnames.push(association.name);
      }
    }
    return assciationnames;
  } 

  
  }
