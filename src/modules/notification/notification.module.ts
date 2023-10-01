import { RabbitMQConfig } from '@infra-common/configs';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTI_SERVICE',
        transport: Transport.RMQ,
        options: RabbitMQConfig.options,
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
