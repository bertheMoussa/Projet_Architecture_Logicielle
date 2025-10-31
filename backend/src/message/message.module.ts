import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProducerService } from 'src/produce/produce.service';
import { MessageService } from './message.service';

@Module({
  imports:[
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
  ],
  providers: [MessageService,ProducerService],
  exports: [MessageService],
})
export class MessageModule {}
