import { MessageService } from './../message/message.service';
// roles.controller.ts
import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, Put, Delete } from '@nestjs/common';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { RoleInput } from './role.input';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleUpdate } from './role.update';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AssociationsService } from 'src/associations/associations.service';

@ApiTags('roles')
@Controller('roles')
export class RoleController {

  constructor(
    private service: RoleService,
    private messageService:MessageService,
    private userService:UsersService,
    private association:AssociationsService
    ) {}

  @Get()
  @ApiOperation({ summary: 'Get all roles', description: 'Retrieve a list of all roles.' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved roles.', type: Role, isArray: true })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAllRoles(): Promise<Role[]> {
    try {
      return await this.service.getAll();
    } catch (error) {
      throw new HttpException('Error while fetching roles.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('users/:name')
  async getUsersByRoleName(@Param('name') roleName: string): Promise<User[]> {
    try {
      return this.service.getUsersByRoleName(roleName);
    } catch (error) {
      throw new HttpException(`Error while fetching users with role ${roleName}.`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

  @Get(':userId/:associationId')
  @ApiOperation({ summary: 'Get role by user ID and association ID', description: 'Retrieve a role by user ID and association ID.' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the role.', type: Role })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getRoleById(@Param('userId') userId: number, @Param('associationId') associationId: number) {
    try {
      const role = await this.service.getById(userId, associationId);
      if (!role) {
        throw new HttpException(`Role not found for User ID ${userId} and Association ID ${associationId}.`, HttpStatus.NOT_FOUND);
      }
      return role;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(`Error while fetching role for User ID ${userId} and Association ID ${associationId}.`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create role', description: 'Create a new role.' })
  @ApiResponse({ status: 201, description: 'Successfully created the role.', type: Role })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createRole(@Body() input) {
    try {
      let rol =await this.service.create(input.name, input.idUser, input.idAssociation);
      let user = await this.userService.getbyId(rol.userId);
      let assoc_name = await (await (this.association.getById(rol.associationId))).name;
      let role = await rol.name;
      this.messageService.roleAddingMailSender(role,assoc_name,user);
      return rol;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Error while creating the role.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Put(':userId/:associationId')
  @ApiOperation({ summary: 'Update role by user ID and association ID', description: 'Update a role by user ID and association ID.' })
  @ApiResponse({ status: 200, description: 'Successfully updated the role.', type: Role })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateRoleById(@Param('userId') userId: number, @Param('associationId') associationId: number, @Body() roleUpdate: RoleUpdate) {
    try {
      let rol =await this.service.update(userId, associationId, roleUpdate);
      let user = await this.userService.getbyId(rol.userId);
      let assoc_name = await (await (this.association.getById(associationId))).name;
      let role = await rol.name;
      this.messageService.roleAddingMailSender(role,assoc_name,user);
      return rol;


    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(`Error while updating role for User ID ${userId} and Association ID ${associationId}.`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Delete(':userId/:associationId')
  @ApiOperation({ summary: 'Delete role by user ID and association ID', description: 'Delete a role by user ID and association ID.' })
  @ApiResponse({ status: 200, description: 'Successfully deleted the role.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteRoleById(@Param('userId') userId: string, @Param('associationId') associationId: string) {
    try {
      return await this.service.delete(Number(userId), Number(associationId));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(`Error while deleting role for User ID ${userId} and Association ID ${associationId}.`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }



}
