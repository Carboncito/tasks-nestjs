import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userDto: Partial<User>) {
    const exist = await this.userModel.find({ email: userDto.email }).exec();

    if (exist.length)
      throw new ConflictException('Email is already registered');

    if (userDto.currentProjectId) {
      userDto.projects = [
        {
          projectId: userDto.currentProjectId,
          startDate: new Date(),
        },
      ];
    }

    const user = new this.userModel(userDto);
    return user.save();
  }

  async findById(id: Types.ObjectId): Promise<UserDocument | undefined> {
    return this.userModel.findById(id).lean().exec();
  }

  async findOne(email: string): Promise<UserDocument | undefined> {
    return this.userModel.findOne({ email }).lean().exec();
  }

  async updateProject(
    userId: Types.ObjectId,
    currentProjectId: Types.ObjectId,
    newProjectId: Types.ObjectId,
  ) {
    await this.removeProject(userId, currentProjectId);
    return this.userModel
      .findByIdAndUpdate(
        userId,
        {
          currentProjectId: newProjectId,
          $push: {
            projects: {
              projectId: newProjectId,
              startDate: new Date(),
              endDate: null,
            },
          },
        },
        { new: true },
      )
      .exec();
  }

  async addProject(
    userId: Types.ObjectId,
    projectId: Types.ObjectId,
  ): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $push: {
            projects: {
              projectId,
              startDate: new Date(),
              endDate: null,
            },
          },
        },
        { new: true },
      )
      .exec();
  }

  async removeProject(
    userId: Types.ObjectId,
    projectId: Types.ObjectId,
  ): Promise<User> {
    return this.userModel
      .findOneAndUpdate(
        { _id: userId, 'projects.projectId': projectId },
        { $set: { 'projects.$.endDate': new Date() } },
        { new: true },
      )
      .exec();
  }
}
