import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ token: string }> {
    const user = await this.userService.findOne(email);

    if (user?.password !== pass) throw new UnauthorizedException();

    const payload = { name: user.name };
    delete user.password;

    return { token: await this.jwtService.signAsync(payload) };
  }
}
