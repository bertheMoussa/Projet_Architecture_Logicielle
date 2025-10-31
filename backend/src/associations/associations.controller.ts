import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, Put, Delete, Inject, forwardRef, Query } from '@nestjs/common';
import { Association } from './association.entity';
import { AssociationsService } from './associations.service';
import { AssociationInput } from './association.input';
import { User } from '../users/user.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Member } from './association.member';
import { MinuteService } from 'src/minute/minute.service';
import { Minute } from 'src/minute/minute.entity';
import { AssociationDTO } from './association.dto';
import { MessageService } from 'src/message/message.service';

@ApiTags('associations')
@Controller('associations')
export class AssociationsController {

    constructor(
        private service: AssociationsService,
        private messageservice: MessageService,
        @Inject(forwardRef(() => MinuteService))
        private minuteService:MinuteService
    ) {}

    @Get()
    @ApiOperation({ summary: 'Get all associations', description: 'Retrieve a list of all associations.' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved associations.', type: AssociationDTO, isArray: true })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async getAllassociations(): Promise<AssociationDTO[]> {
        try {
            return this.service.getAll();
        } catch (error) {
            throw new HttpException('Error while fetching associations.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get association by ID', description: 'Retrieve an association by its ID.' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved the association.', type: AssociationDTO })
    @ApiResponse({ status: 404, description: 'Association not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    getbyId(@Param('id') id: string) {
        try {
            const association = this.service.getById(+id);
            if (!association) {
                throw new HttpException(`Association with ID ${id} not found.`, HttpStatus.NOT_FOUND);
            }
            return association;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(`Error while fetching association with ID ${id}.`, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get(':id/minutes')
    @ApiOperation({ summary: 'Get minutes by association ID', description: 'Retrieve minutes for an association by ID, sorted and ordered as specified.' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved association minutes.', type: Minute, isArray: true })
    @ApiResponse({ status: 404, description: 'Association not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async getMinutesByAssociationId(@Param('id') id: string, @Query('sort') sort: string, @Query('order') order: 'ASC' | 'DESC'): Promise<Minute[]> {
        try {
            const minutes = await this.minuteService.getMinutesByAssociationId(+id, sort, order);
            return minutes;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(`Error while fetching minutes for association with ID ${id}.`, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create association', description: 'Create a new association.' })
    @ApiResponse({ status: 201, description: 'Successfully created the association.', type: Association })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async create(@Body() input: AssociationInput) {
        try {
           let assoc=  await this.service.create(input.name, input.idUsers);
           await this.messageservice.associationUsersMailSender( assoc);
           return assoc;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException('Error while creating the association.', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update association by ID', description: 'Update an association by its ID.' })
    @ApiResponse({ status: 200, description: 'Successfully updated the association.', type: Association })
    @ApiResponse({ status: 404, description: 'Association not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    updatebyId(@Param('id') id: string, @Body() input) {
        try {
            return this.service.updatebyID(+id, input.users, input.name);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(`Error while updating association with ID ${id}.`, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete association by ID', description: 'Delete an association by its ID.' })
    @ApiResponse({ status: 200, description: 'Successfully deleted the association.' })
    @ApiResponse({ status: 404, description: 'Association not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    deletebyId(@Param('id') id: string) {
        try {
            return this.service.deletebyID(+id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(`Error while deleting association with ID ${id}.`, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get(':id/members')
    @ApiOperation({ summary: 'Get members of an association', description: 'Retrieve members of an association by ID.' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved association members.', type: User, isArray: true })
    @ApiResponse({ status: 404, description: 'Association not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    getMembers(@Param('id') id: string): Promise<Member[]> {
        try {
            return this.service.getmembers(+id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(`Error while fetching members of association with ID ${id}.`, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }


    @Get(':id/idmembers')
  @ApiOperation({
    summary: 'Get the IDs of the members of an association by ID',
    description: 'Retrieve the IDs of the members of an association by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved association members ids .',
    type: Number,
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'Association not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getMembersId(@Param('id') id: number): Promise<number[]> {
    return await this.service.getmembersId(id);
}}
