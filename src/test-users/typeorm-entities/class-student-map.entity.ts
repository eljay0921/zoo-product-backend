import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from './class.entity';
import { Student } from './student.entity';

@Entity()
export class ClassStudentMap {
  @PrimaryGeneratedColumn()
  seq: number;

  @ManyToOne(() => Student, (student) => student.mapping)
  student?: Student;

  @ManyToOne(() => Lesson, (lesson) => lesson.mapping)
  class?: Lesson;

  @CreateDateColumn()
  createdAt?: Date;
}
