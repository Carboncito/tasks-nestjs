import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
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
import { UpdateProjectDto } from './dto/update-project.dto';

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

    return user.projects.map((project) => ({
      ...project.projectId,
      ...project,
      projectId: project.projectId._id,
    }));
  }
  // findById
  // create
  @Post()
  create(@Body() projectDto: CreateProjectDto) {
    return this.projectsService.create(projectDto);
  }

  @Put(':projectId')
  async update(
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const project = await this.projectsService.update(
      projectId,
      updateProjectDto,
    );

    if (!project) throw new NotFoundException('Project not found');

    return project;
  }

  @Delete(':projectId')
  async delete(@Param('projectId') projectId: string) {
    const users = await this.userService.getUsersByProjectId(projectId);

    if (users.length)
      throw new ConflictException(`Project with ${projectId} id has partners`);

    const projectDeleted = await this.projectsService.delete(projectId);

    if (!projectDeleted) throw new NotFoundException('Project not found');

    return projectDeleted;
  }
}
