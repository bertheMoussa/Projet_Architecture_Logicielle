import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { RoleModule } from 'src/role/role.module';
import { AssociationsModule } from 'src/associations/associations.module';

@Module({
  imports: [forwardRef(() => RoleModule), forwardRef(() => AssociationsModule), TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule, UsersModule]
})
export class UsersModule {}
