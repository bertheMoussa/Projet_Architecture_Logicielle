import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Association } from '../associations/association.entity';

@Entity()
export class Minute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  date: string;

  @ManyToMany(() => User)
  @JoinTable()
  voters: User[];

  @ManyToOne(() => Association, association => association.minutes)
  associationId: number; // 

}
