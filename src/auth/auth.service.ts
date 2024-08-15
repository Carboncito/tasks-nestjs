import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'user/user.service';
import { UserRequest } from '../common/interfaces/user-request.interface';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ token: string }> {
    const user = await this.userService.findOne(email);

    if (user?.password !== pass) throw new UnauthorizedException();

    const payload: UserRequest['user'] = {
      id: user._id as Types.ObjectId,
      email: user.email,
    };

    return { token: await this.jwtService.signAsync(payload) };
  }
}
