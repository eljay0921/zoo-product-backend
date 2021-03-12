import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassStudentMap } from './typeorm-entities/class-student-map.entity';
import { Lesson } from './typeorm-entities/class.entity';
import { Student } from './typeorm-entities/student.entity';
import { TestUsersService } from './test-users.service';
import { TestUserResolver } from './test-users.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Lesson, ClassStudentMap])],
  providers: [TestUsersService, TestUserResolver]
})
export class TestUsersModule {}
