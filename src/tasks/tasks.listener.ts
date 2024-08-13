import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskAddedEvent } from './events/task-added.event';
import { TaskRemovedEvent } from './events/task-removed.event';

@Injectable()
export class TasksListener {
  @OnEvent('task.added')
  handleTaskAddedEvent(event: TaskAddedEvent) {
    console.log(`Task added: ID=${event.taskId}, Name=${event.taskName}`);
  }

  @OnEvent('task.removed')
  handleTaskRemovedEvent(event: TaskRemovedEvent) {
    console.log(`Task removed: ID=${event.taskId}`);
  }
}
