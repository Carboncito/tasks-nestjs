import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from 'schemas/project.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(projectDto: Project) {
    const project = new this.projectModel(projectDto);
    return project.save();
  }

  async findById(id: Types.ObjectId) {
    return this.projectModel.findById(id);
  }

  async getAll() {
    return this.projectModel.find();
  }
}
