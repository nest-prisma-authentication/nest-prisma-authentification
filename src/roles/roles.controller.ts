import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(<Prisma.RoleCreateInput>createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, <Prisma.RoleUpdateInput>updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  @Post(':id/permissions/:permissionId') 
  addPermission(@Param('id') id: string, @Param('permissionId') permissionId: string) {
    return this.rolesService.addPersmission(id, permissionId);
  }
  @Delete(':id/permissions/:permissionId') 
  removePermission(@Param('id') id: string, @Param('permissionId') permissionId: string) {
    return this.rolesService.removePersmission(id, permissionId);
  }
}
