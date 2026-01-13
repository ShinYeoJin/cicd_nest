import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import fc from 'fast-check';

describe('StudentsService', () => {
  let service: StudentsService;
  let mockRepo: any


  // 테스트 전에 실행되는 함수
  beforeEach(async () => {
    mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentsService, {useValue: mockRepo, provide: getRepositoryToken(Student)}],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
  });

  // 테스트 함수 (test 랑 it 이랑 같은 역할)
  it("학생 서비스 create 테스트", async () => {
    const createDto = {
      name: "John Doe",
      email: "john.doe@example.com",
      age: 20,
    };

    mockRepo.create.mockReturnValue(createDto); //create 함수가 실행되면 createDto를 반환
    mockRepo.save.mockResolvedValue({...createDto, id: 1, isActive: true}); //save 함수가 실행되면 promise 성공 케이스 돌려줌

    const result = await service.create(createDto);

    expect(result).toEqual({...createDto, id: 1, isActive: true});
    expect(mockRepo.create).toHaveBeenCalledWith(createDto);
  });


  it("학생 생성 테스트_fast-check 버전", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({minLength: 1, maxLength: 50}),
          email: fc.emailAddress(),
          age: fc.integer({min: 1, max: 100}),
        }),
        async (dto) => {
          mockRepo.create.mockReturnValue(dto);
          mockRepo.save.mockResolvedValue({...dto, id: fc.integer({min: 1, max: 1000000}), isActive: true});

          console.log({dto});
          const result = await service.create(dto);

          expect(result).toHaveProperty('id');
          expect(result).toHaveProperty('isActive');
          expect(result.name).toBe(dto.name);
          expect(result.email).toBe(dto.email);
          expect(result.age).toBe(dto.age);
          expect(mockRepo.create).toHaveBeenCalledWith(dto);
        }
      )
    );
  });
});
