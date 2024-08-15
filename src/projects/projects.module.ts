import { Module } from '@nestjs/common';
import { ProjectController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'user/user.module';
import { Project, ProjectSchema } from '../../schemas/project.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [ProjectController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
