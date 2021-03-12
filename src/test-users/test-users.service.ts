import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentInput, StudentOutput } from './graphql-types/student.types';
import { Student } from './typeorm-entities/student.entity';

@Injectable()
export class TestUsersService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  async getStudents(): Promise<StudentOutput> {
    const result = await this.studentRepo.find();
    return {
      ok: true,
      error: '',
      students: result,
    };
  }

  async insertStudents(createStudent: StudentInput): Promise<StudentOutput> {
    const result = await this.studentRepo.save(
      this.studentRepo.create(createStudent),
    );

    return {
      ok: true,
      error: '',
    //   students: [...result],
    };
  }
}
