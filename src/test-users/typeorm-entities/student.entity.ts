import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { eSexType } from '../common.enum.types';
import { ClassStudentMap } from './class-student-map.entity';

@Entity()
export class Student {
  @PrimaryColumn()
  name: string;

  @Column()
  age: number;

  @Column()
  sex: eSexType;

  @OneToMany(() => ClassStudentMap, (map) => map.student)
  mapping?: ClassStudentMap;
}
