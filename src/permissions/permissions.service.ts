import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private prismaService: PrismaService) { }
  
  async create(createPermissionDto: Prisma.PermissionCreateInput) {
    try {
      let createdPermission = await this.prismaService.permission.create({data: createPermissionDto});
      return createdPermission;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException("Permission already exist");
        } else {
          throw error;
        }
      }
      throw error;
    }
  }

  findAll() {
    return this.prismaService.permission.findMany();
  }

  async findOne(id: string) {
    try {
      let permission = await this.prismaService.permission.findUnique({where: {id}});
      if(!permission) {
        throw new NotFoundException(`Permission with id ${id} not found`);
      }
      return permission;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // id is not a valid objectId
        if (error.code == 'P2023') {
          throw new BadRequestException(`Provided hex string ${id} representation must be exactly 12 bytes`)
        }
        throw error;
      }
      throw error;
    }
  }

  async update(id: string, updatePermissionDto: Prisma.PermissionUpdateInput) {
    try {
      let permission = await this.findOne(id);
      return this.prismaService.permission.update({where: {id}, data:updatePermissionDto});
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    let permission = await this.findOne(id);
    return this.prismaService.permission.delete({where: {id}});
  }
}
