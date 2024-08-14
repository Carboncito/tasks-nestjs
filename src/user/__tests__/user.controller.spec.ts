import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDocument } from '../../../schemas/user.schema';
import { ConflictException } from '@nestjs/common';
import { UserRequest } from 'common/interfaces/user-request.interface';
import { Types } from 'mongoose';
import { UpdateProjectUserDto } from 'user/dto/update-project-user.dto';

const email = 'test@example.com';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            addProject: jest.fn(),
            updateProject: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get(UserController);
    userService = module.get(UserService);
  });

  describe('updateProject', () => {
    it('Should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const createdUser = {
        email: 'test@example.com',
        password: 'password',
        projects: [],
      } as UserDocument;

      jest.spyOn(userService, 'create').mockResolvedValue(createdUser);

      expect(await userController.create(createUserDto)).toBe(createdUser);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('Should throw a ConflictException if the email is already registered', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'pass',
      };
      jest
        .spyOn(userService, 'create')
        .mockRejectedValue(
          new ConflictException('Email is already registered'),
        );
      await expect(userController.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('updateProject', () => {
    it('should add a project if the user has no current project', async () => {
      const userRequest: UserRequest = {
        user: { id: new Types.ObjectId(), email },
      } as UserRequest;
      const updateProjectUserDto: UpdateProjectUserDto = {
        projectId: new Types.ObjectId(),
      };
      const user = {
        _id: new Types.ObjectId(),
        currentProjectId: null,
      } as UserDocument;

      jest.spyOn(userService, 'findById').mockResolvedValue(user);
      jest.spyOn(userService, 'addProject').mockResolvedValue(user);

      expect(
        await userController.updateProject(userRequest, updateProjectUserDto),
      ).toBe(user);
      expect(userService.findById).toHaveBeenCalledWith(userRequest.user.id);
      expect(userService.addProject).toHaveBeenCalledWith(
        user._id,
        updateProjectUserDto.projectId,
      );
    });

    it('should throw a ConflictException if the new project is the same as the current project', async () => {
      const userRequest: UserRequest = {
        user: { id: new Types.ObjectId(), email },
      } as UserRequest;
      const updateProjectUserDto: UpdateProjectUserDto = {
        projectId: new Types.ObjectId(),
      };
      const user = {
        _id: new Types.ObjectId(),
        currentProjectId: updateProjectUserDto.projectId,
      } as UserDocument;

      jest.spyOn(userService, 'findById').mockResolvedValue(user);

      await expect(
        userController.updateProject(userRequest, updateProjectUserDto),
      ).rejects.toThrow(ConflictException);
    });

    it('Should update the project if the new project is different from the current project', async () => {
      const userRequest: UserRequest = {
        user: { id: new Types.ObjectId(), email },
      } as UserRequest;
      const updateProjectUserDto: UpdateProjectUserDto = {
        projectId: new Types.ObjectId(),
      };
      const user = {
        _id: new Types.ObjectId(),
        currentProjectId: new Types.ObjectId(),
      } as UserDocument;

      jest.spyOn(userService, 'findById').mockResolvedValue(user);
      jest.spyOn(userService, 'updateProject').mockResolvedValue(user);

      expect(
        await userController.updateProject(userRequest, updateProjectUserDto),
      ).toBe(user);
      expect(userService.updateProject).toHaveBeenCalledWith(
        new Types.ObjectId(userRequest.user.id),
        user.currentProjectId,
        updateProjectUserDto.projectId,
      );
    });
  });
});
