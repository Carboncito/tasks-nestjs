import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from 'schemas/project.schema';
import { Task, TaskDocument } from 'schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskAddedEvent } from './events/task-added.event';
import { TaskRemovedEvent } from './events/task-removed.event';

@Injectable()
export class TasksService {
  private readonly eventEmitter: EventEmitter2;

  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    eventEmitter: EventEmitter2,
  ) {
    this.eventEmitter = eventEmitter;
  }

  async getTasksForProject(projectId: string) {
    return this.taskModel.find({ projectId }).exec();
  }

  async addTaskToProject(
    projectId: string,
    taskDto: CreateTaskDto,
  ): Promise<Task> {
    const task = new this.taskModel({
      ...taskDto,
      projectId,
    });

    await task.save();

    await this.projectModel
      .updateOne({ _id: projectId }, { $push: { tasks: task._id } })
      .exec();

    this.eventEmitter.emit(
      'task.added',
      new TaskAddedEvent(task._id.toString(), task.name),
    );

    return task;
  }

  async updateTask(
    projectId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    const task = this.taskModel
      .findOneAndUpdate({ _id: taskId, projectId }, updateTaskDto, {
        new: true,
      })
      .exec();

    if (!task) {
      throw new NotFoundException(
        `Task with ID ${taskId} not found in project ${projectId}`,
      );
    }

    return task;
  }

  async deleteTask(projectId: string, taskId: string): Promise<void> {
    const res = await this.taskModel
      .deleteOne({ _id: taskId, projectId })
      .exec();

    if (res.deletedCount === 0)
      throw new NotFoundException(
        `Task with ID ${taskId} not found in project ${projectId}`,
      );

    await this.projectModel
      .updateOne({ _id: projectId }, { $pull: { tasks: taskId } })
      .exec();

    this.eventEmitter.emit('task.removed', new TaskRemovedEvent(taskId));
  }
}
