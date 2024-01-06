import { Get, Controller, UseGuards, Patch, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { GenericRequest, GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard'; // * use relative paths
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // * Generic request is a decorator that returns the user object from the request object. We made it generic because nest works with express and another framework which I forgot, and we let it decide whatever to use (I think by default, express)
  // * See the custom decorator in the auth folder for more info.

  // * The user object which we are returning is defined in jwt.strategy.ts
  // * The JwtGuard is a guard that checks if the user is authenticated. If the user is, it will return the user object. If not, it will throw an error.

  @UseGuards(JwtGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMe(@GenericRequest() request: any /* @GetUser('email') email: string*/) {
    // console.log({
    //   email,
    // });
    return request.user;
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateMe(@GetUser('id') id: number, @Body() dto: EditUserDto) {
    return await this.userService.updateUser(id, dto);
  }
}
