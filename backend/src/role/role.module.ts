import { Module, forwardRef } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { UsersModule } from 'src/users/users.module';
import { MessageModule } from 'src/message/message.module';
import { AssociationsModule } from 'src/associations/associations.module';

@Module({
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([Role]), MessageModule, forwardRef(() => AssociationsModule)],  controllers: [RoleController],
  providers: [RoleService],
  exports:[RoleService]
})
export class RoleModule {}
