// minutes.controller.ts
import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, Put, Delete } from '@nestjs/common';
import { Minute } from './minute.entity';
import { MinuteInput} from './minute.input';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MinuteUpdate } from './minute.update';
import { MinuteService } from './minute.service';

@ApiTags('minutes')
@Controller('minutes')
export class MinuteController {
  constructor(private service: MinuteService) {}

  @Get()
  @ApiOperation({ summary: 'Get all minutes', description: 'Retrieve a list of all minutes.' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved minutes.', type: Minute, isArray: true })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAllMinutes(): Promise<Minute[]> {
    try {
      return await this.service.getAll();
    } catch (error) {
      throw new HttpException('Error while fetching minutes.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get minute by ID', description: 'Retrieve a minute by its ID.' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the minute.', type: Minute })
  @ApiResponse({ status: 404, description: 'Minute not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getMinuteById(@Param('id') id: string) {
    try {
      const minute = await this.service.getById(Number(id));
      if (!minute) {
        throw new HttpException(`Minute with ID ${id} not found.`, HttpStatus.NOT_FOUND);
      }
      return minute;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(`Error while fetching minute with ID ${id}.`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create minute', description: 'Create a new minute.' })
  @ApiResponse({ status: 201, description: 'Successfully created the minute.', type: Minute })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createMinute(@Body() minuteInput: MinuteInput) {
    try {
      return await this.service.create(minuteInput);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Error while creating the minute.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update minute by ID', description: 'Update a minute by its ID.' })
  @ApiResponse({ status: 200, description: 'Successfully updated the minute.', type: Minute })
  @ApiResponse({ status: 404, description: 'Minute not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateMinuteById(@Param('id') id: string, @Body() minuteUpdate: MinuteUpdate) {
    try {
      return await this.service.update(Number(id), minuteUpdate);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(`Error while updating minute with ID ${id}.`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete minute by ID', description: 'Delete a minute by its ID.' })
  @ApiResponse({ status: 200, description: 'Successfully deleted the minute.' })
  @ApiResponse({ status: 404, description: 'Minute not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteMinuteById(@Param('id') id: string) {
    try {
      return await this.service.delete(Number(id));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(`Error while deleting minute with ID ${id}.`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
