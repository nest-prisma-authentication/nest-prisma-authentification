import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    let createdUser = await this.usersService.create(<Prisma.UserCreateInput>createUserDto)
    delete(createdUser.password);
    return createdUser;
  }

  @Get()
  async findAll() {
    let users = await this.usersService.findAll();
    // Remove passowrd from the users
    users.map((user)=> {
      delete(user.password);
    })
    return users;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let user = await this.usersService.findOne(id);
    delete(user.password);
    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    let udpatedUser = await this.usersService.update(id, <Prisma.UserUpdateInput>updateUserDto);
    delete (udpatedUser.password);
    return udpatedUser;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':id/roles/:roleId')
  addPermission(@Param('id') id: string, @Param('roleId') roleId: string) {
    return this.usersService.addRole(id, roleId);
  }
  @Delete(':id/roles/:roleId')
  removePermission(@Param('id') id: string, @Param('roleId') roleId: string) {
    return this.usersService.removeRole(id, roleId);
  }
}
