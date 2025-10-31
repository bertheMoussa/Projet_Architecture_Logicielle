import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssociationsModule } from './associations/associations.module';
import { AuthModule } from './auth/auth.module';
import { MessageService } from './message/message.service';
import { MinuteModule } from './minute/minute.module';
import { RoleModule } from './role/role.module';
import { UsersModule } from './users/users.module';
@Module({
  imports:[
    ConfigModule.forRoot({isGlobal: true, envFilePath: '../.env'}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('POSTGRES_HOST'),
        username: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASSWORD'),
        database: config.get<string>('POSTGRES_DB'),
        port: config.get<number>('POSTGRES_PORT'),
        entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
        logging: true,
      }),
    }),
    ClientsModule.register([{
      name: 'GREETING_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls:['amqp://guest:guest@rabbitmq:5672/'],
        queue: 'quarkus_queue',
        queueOptions: {
          durable: false
        }
      }
    }]),
    UsersModule,
    AssociationsModule,
    AuthModule,
    MinuteModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService, MessageService],
  exports: [MessageService],
})
export class AppModule {
  static forRootAsync: any;
  static forRoot(): any {
    throw new Error('Method not implemented.');
  }
}
