import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SendMailInput } from '@infra-common';
import { NotificationService } from './notification.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('notification')
@ApiTags('Notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post('mail')
  @HttpCode(HttpStatus.ACCEPTED)
  sendMail(@Body() payload: SendMailInput): Observable<any> {
    return this.notificationService.sendMail(payload);
  }
}
