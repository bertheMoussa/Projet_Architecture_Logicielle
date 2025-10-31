import { Module, forwardRef } from '@nestjs/common';
import { AssociationsController } from './associations.controller';
import { AssociationsService } from './associations.service';
import { UsersModule } from 'src/users/users.module';
import { Association } from './association.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { MinuteModule } from 'src/minute/minute.module';
import { RoleModule } from 'src/role/role.module';
import { MinuteService } from 'src/minute/minute.service';
import { RoleService } from 'src/role/role.service';
import { MessageService } from 'src/message/message.service';
import { MessageModule } from 'src/message/message.module';

@Module({
  controllers: [AssociationsController],
  providers: [AssociationsService],
  imports: [TypeOrmModule.forFeature([Association]),forwardRef(() => RoleModule), forwardRef(() => UsersModule),forwardRef(() => MinuteModule),MessageModule],
  exports:[AssociationsService]

})
export class AssociationsModule {}
