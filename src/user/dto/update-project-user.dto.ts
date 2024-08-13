import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateProjectUserDto {
  @IsString()
  readonly projectId: Types.ObjectId;
}
