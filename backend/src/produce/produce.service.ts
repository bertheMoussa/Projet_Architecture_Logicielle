import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { Message } from 'src/message/message.entity';

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;
  constructor() {
    const connection = amqp.connect(['localhost:15672']);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('quarkus_queue', { durable: true });
      },
    });
  }
  async addToQuarkusQueue(msg: Message) {
    try {
      const messageBuffer = Buffer.from(JSON.stringify(msg)); // Convertir l'objet en Buffer
      await this.channelWrapper.sendToQueue('quarkus_queue', messageBuffer);
      Logger.log('Sent To Queue');
    } catch (error) {
      throw new HttpException(
        'Error adding mail to queue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
