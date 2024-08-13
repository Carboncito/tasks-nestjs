import { Request } from '@nestjs/common';
import { Types } from 'mongoose';

export interface UserRequest extends Request {
  user?: {
    id: Types.ObjectId;
    email: string;
  };
}
