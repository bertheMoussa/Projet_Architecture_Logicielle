import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Member } from './association.member';

@Entity()
export class AssociationDTO {
  id: number;
  name: string;
  members?: Member[];

  constructor(id:number, name: string, members?: Member[]) {
    this.id = id;
    this.name = name;
    this.members = members;
  }
}
