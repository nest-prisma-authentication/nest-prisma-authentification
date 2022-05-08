import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PermissionsService } from 'src/permissions/permissions.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private prismaService: PrismaService, private permissionsService: PermissionsService){}
  async create(createRoleDto: Prisma.RoleCreateInput) {
    try {
      let createdRole = await this.prismaService.role.create({ data: createRoleDto });
      return createdRole;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException("Role already exist");
        } else {
          throw error;
        }
      }
      throw error;
    }
  }

  findAll() {
    return this.prismaService.role.findMany();
  }

  async findOne(id: string) {
    try {
      const user = await this.prismaService.role.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user;
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

  async update(id: string, updateRoleDto: Prisma.RoleUpdateInput) {
    let role = await this.findOne(id);
    return this.prismaService.role.update({where: {id}, data:updateRoleDto});
  }

  async remove(id: string) {
    let role = await this.findOne(id);
    return this.prismaService.role.delete({where: {id}});
  }

  async addPersmission(id: string, permissionId: string) {
    let role = await this.findOne(id);
    let permission = await this.permissionsService.findOne(permissionId);
    return this.prismaService.role.update({where:{id}, data:{
      permissions: {
        connect: [{id: permissionId}]
      }
    }})
  }
  async removePersmission(id: string, permissionId: string) {
    let role = await this.findOne(id);
    let permission = await this.permissionsService.findOne(permissionId);
    return this.prismaService.role.update({where:{id}, data:{
      permissions: {
        disconnect: [{id: permissionId}]
      }
    }})
  }
}
