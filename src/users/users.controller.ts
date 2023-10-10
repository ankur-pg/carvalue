import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private service: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    console.log(body)
    this.service.createUser(body.email, body.password)
  }

  @Get()
  findAllUsers(@Param('email') email: string) {
    return this.service.find(email)
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.service.findOne(parseInt(id))
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.service.update(parseInt(id), body)
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.service.remove(parseInt(id))
  }
}
