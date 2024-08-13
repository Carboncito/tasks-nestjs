import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
class ProjectInfo {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  startDate: Date;

  @Prop({ type: Date })
  endDate?: Date;
}

const ProjectInfoSchema = SchemaFactory.createForClass(ProjectInfo);

@Schema()
export class User {
  @Prop({ unique: true, type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  name?: string;

  @Prop({ type: [ProjectInfoSchema], default: [] })
  projects: ProjectInfo[];

  @Prop({ type: Date })
  @Prop()
  birthday?: Date;

  @Prop({ type: Types.ObjectId })
  currentProjectId?: Types.ObjectId;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
