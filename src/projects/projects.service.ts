import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../../schemas/project.schema';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(projectDto: Project) {
    const project = new this.projectModel(projectDto);
    return project.save();
  }

  async update(projectId: string, projectDto: UpdateProjectDto) {
    return this.projectModel
      .findByIdAndUpdate(projectId, projectDto, { new: true })
      .lean()
      .exec();
  }

  async delete(projectId: string) {
    return this.projectModel.findByIdAndDelete(projectId);
  }

  async findById(id: string) {
    return this.projectModel.findById(id);
  }

  async getAll() {
    return this.projectModel.find();
  }
}
