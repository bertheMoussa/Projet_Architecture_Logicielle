import { Module, forwardRef } from '@nestjs/common';
import { MinuteController } from './minute.controller';
import { MinuteService } from './minute.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Minute } from './minute.entity';
import { AssociationsModule } from 'src/associations/associations.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Minute]),forwardRef(() => AssociationsModule),forwardRef(() => UsersModule)],
  controllers: [MinuteController],
  providers: [MinuteService],
  exports: [MinuteService]
})
export class MinuteModule {}
