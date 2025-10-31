// minutes.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Minute } from './minute.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { MinuteInput } from './minute.input';
import { MinuteUpdate } from './minute.update';

@Injectable()
export class MinuteService {
  constructor(
    @InjectRepository(Minute)
    private repository: Repository<Minute>,
  ) {}

  async getAll(): Promise<Minute[]> {
    return await this.repository.find();
  }


  async getById(id: number): Promise<Minute | undefined> {
    return await this.repository.findOne({where: {id: id}});
  }

  async create(minuteInput: MinuteInput): Promise<Minute> {
    const { content, idVoters, date, idAssociation } = minuteInput;
    const minute = this.repository.create({
      content,
      voters: idVoters ? idVoters.map(userId => ({ id: userId })) : [],
      date,
      associationId: idAssociation ,
    });
    await this.repository.save(minute);
    return minute;
  }

  async update(id: number, minuteUpdate: MinuteUpdate): Promise<Minute> {
    const minute = await this.getById(id);
    if (!minute) {
      throw new HttpException('Minute not found', HttpStatus.NOT_FOUND);
    }

    minute.content = minuteUpdate.content || minute.content;
    minute.voters = minuteUpdate.idVoters ? minuteUpdate.idVoters.map(userId => ({ id: userId })) : (minute.voters as any[]);    minute.date = minuteUpdate.date || minute.date;

    return await this.repository.save(minute);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  async getMinutesByAssociationId(
    associationId: number,
    sort: string = 'date',
    order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<Minute[]> {
    try {
      return await this.repository.find({
        where: { associationId: associationId  },
        order: { [sort]: order },
      });
    } catch (error) {
      throw new HttpException('Error while fetching minutes.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
