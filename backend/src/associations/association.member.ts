import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Member {
  id: number;

  name: string;

  firstname: string;

  age: number;

  role: string;

  

  constructor(id: number, name: string, firstname: string, age: number, role: string) {
    this.id = id;
    this.name = name;
    this.firstname = firstname;
    this.age = age;
    this.role = role;
  }
}
