import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service';
import { SendMailPayload } from '@infra-common/dtos';
import env from '@environments';

@Controller(`v${env.API_VERSION}/notification`)
@ApiTags('Notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post('mail')
  @HttpCode(HttpStatus.ACCEPTED)
  sendMail(@Body() payload: SendMailPayload): Observable<any> {
    return this.notificationService.sendMail(payload);
  }
}
