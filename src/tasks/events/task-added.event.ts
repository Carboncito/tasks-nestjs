export class TaskAddedEvent {
  constructor(
    public readonly taskId: string,
    public readonly taskName: string,
  ) {}
}
