import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import {
  QueryParamsProjects,
  QueryParamsProjectsPipe,
} from './pipe/query-params-projects/query-params-projects.pipe';
import { UserRequest } from 'src/common/interfaces/user-request.interface';
import { CreateProjectDto } from './dto/create-project.dto';
import { UserService } from 'src/user/user.service';

@Controller('projects')
export class ProjectController {
  constructor(
    private projectsService: ProjectsService,
    private userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getProjectsUser(
    @Request() request: UserRequest,
    @Query(QueryParamsProjectsPipe) query: QueryParamsProjects,
  ) {
    if (query.all) return this.projectsService.getAll();

    const user = await this.userService.findById(request.user.id);

    const currentProjectId = user?.currentProjectId;

    if (!currentProjectId)
      throw new NotFoundException("User doesn't have an assigned project");

    return this.projectsService.findById(currentProjectId);
  }
  // findById
  // create
  @Post()
  create(@Body() projectDto: CreateProjectDto) {
    return this.projectsService.create(projectDto);
  }
}
