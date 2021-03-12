import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ClassStudentMap } from './class-student-map.entity';

@Entity()
export class Lesson {
  @PrimaryColumn()
  title: string;

  @Column()
  time: number;

  @OneToMany(() => ClassStudentMap, (map) => map.class)
  mapping?: ClassStudentMap;
}
