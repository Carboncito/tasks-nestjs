import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/common/decorators/Public.decorator';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post()
  createUser(@Body() userDto: UserDto) {
    return this.userService.create(userDto);
  }
}
