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
          headers: { 'm-api-key': env.VHM_API_KEY },
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
