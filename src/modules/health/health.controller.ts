import { Public } from '@common';
import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly http: HttpHealthIndicator,
    @Inject('NOTI_SERVICE')
    private notificationService: ClientProxy,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  check() {
    this.notificationService.emit('send_mail', {
      msg: 'ACK_SEND_MAIL',
      status: 200,
    });
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }

  @Get('heap')
  @HealthCheck()
  checkHeap() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
