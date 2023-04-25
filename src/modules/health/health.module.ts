import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import env from '@environments';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    ClientsModule.register([
      {
        name: 'NOTI_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [env.RABBITMQ_URL],
          queue: env.RABBITMQ_QUEUE,
          noAck: false,
          headers: { 'Content-Type': 'application/json' },
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [HealthController],
  // providers: [
  //   {
  //     provide: 'NOTIFICATION_SERVICE',
  //     useFactory: () => {
  //       return ClientProxyFactory.create({
  //         transport: Transport.TCP,
  //         options: {
  //           host: env.NOTIFICATION_HOST,
  //           port: +env.NOTIFICATION_PORT,
  //         },
  //       });
  //     },
  //   },
  // ],
})
export class HealthModule {}
