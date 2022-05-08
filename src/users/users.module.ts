import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [RolesModule],
  controllers: [UsersController],
  providers: [UsersService, CreateUserDto],
  exports: [UsersService, CreateUserDto]
})
export class UsersModule {}
