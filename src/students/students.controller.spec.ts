import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';

describe('StudentsController', () => {
  let controller: StudentsController;
  let mockRepo: any

  beforeEach(async () => {
    mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        StudentsService, 
        {useValue: mockRepo, provide: getRepositoryToken(Student)},
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
  });

  it('학생 findOne get 테스트', () => {
    expect(controller.findOne('10')).toBe('학생 10');
  });
});
