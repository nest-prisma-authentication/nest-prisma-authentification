import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  constructor (private prismaService: PrismaService, private rolesService: RolesService) {}
  async create(createUserDto: Prisma.UserCreateInput) {
    try {
      let hasedPassword = await bcrypt.hash(createUserDto.password, await bcrypt.genSalt(10))
      createUserDto.password = hasedPassword;
      let createdUser = await this.prismaService.user.create({ data: createUserDto });
      return createdUser;
    } catch (error) {
      // Handle contrainst error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException("Email already exist");
        } else {
          throw error;
        }
      }
      // Handle validation error 
      if(error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Invalid date')
      }
      throw error;
    }
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: string) {
    try {
      const user = await this.prismaService.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      if(error instanceof PrismaClientKnownRequestError) {
        // id is not a valid objectId
        if (error.code == 'P2023') {
          throw new BadRequestException(`Provided hex string ${id} representation must be exactly 12 bytes`)
        }
        throw error;
      }
      throw error;
    }
  }

  async update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    const user = await this.findOne(id);
    try {
      const updatedUser = await this.prismaService.user.update({ where: { id }, data: updateUserDto });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    let user = await this.findOne(id);
    return this.prismaService.user.delete({where: {id}});
  }

  async findByEmail(email: string) {
    try {
      const user = this.prismaService.user.findFirst({where: {email}});
      if(!user){
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async addRole(id: string, roleId: string) {
    let user = await this.findOne(id);
    let role = await this.rolesService.findOne(roleId);
    return this.prismaService.user.update({
      where: { id }, data: {
        roles: {
          connect: [{ id: roleId }]
        }
      }
    })
  }
  async removeRole(id: string, roleId: string) {
    let user = await this.findOne(id);
    let role = await this.rolesService.findOne(roleId);
    return this.prismaService.user.update({
      where: { id }, data: {
        roles: {
          disconnect: [{ id: roleId }]
        }
      }
    })
  }
}
