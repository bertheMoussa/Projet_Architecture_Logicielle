import { Association } from 'src/associations/association.entity';
import { Role } from 'src/role/role.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  age: number;

  @Column()
  password: string; 

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @ManyToMany(() => Association, { cascade: true })
  @JoinTable()
  associations: String[];

}
