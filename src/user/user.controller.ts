import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProjectUserDto } from './dto/update-project-user.dto';
import { Public } from 'common/decorators/Public.decorator';
import { UserRequest } from 'common/interfaces/user-request.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }

  @Patch('project')
  async updateProject(
    @Request() request: UserRequest,
    @Body() dto: UpdateProjectUserDto,
  ) {
    const user = await this.userService.findById(request.user.id);

    if (!user?.currentProjectId) {
      return this.userService.addProject(user._id as string, dto.projectId);
    }

    if (user.currentProjectId === dto.projectId)
      throw new ConflictException(
        'New project should be different to the current project',
      );

    return this.userService.updateProject(
      request.user.id,
      user.currentProjectId,
      dto.projectId,
    );
  }
}
