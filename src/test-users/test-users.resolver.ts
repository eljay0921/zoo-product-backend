import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StudentInput, StudentOutput } from './graphql-types/student.types';
import { TestUsersService } from './test-users.service';
import { Student } from './typeorm-entities/student.entity';

@Resolver(() => Student)
export class TestUserResolver {
  constructor(private readonly testUserService: TestUsersService) {}

  @Query(() => StudentOutput)
  getStudents() {
    return this.testUserService.getStudents();
  }

  @Mutation(() => StudentOutput)
  insertStudents(@Args('input') createStudentInput:StudentInput) {
    return this.testUserService.insertStudents(createStudentInput);
  }
}
