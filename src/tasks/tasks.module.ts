import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from '../../schemas/task.schema';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Project, ProjectSchema } from '../../schemas/project.schema';
import { ProjectsModule } from 'projects/projects.module';
import { TasksListener } from './tasks.listener';

@Module({
  imports: [
    ProjectsModule,
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksListener],
})
export class TasksModule {}
