import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Association } from '../associations/association.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  userId: number;

  @Column()
  associationId: number;

  @ManyToOne(type => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Promise <User>;

  @ManyToOne(type => Association, association => association.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'associationId' })
  association: Promise<Association>;
}
