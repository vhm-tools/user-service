import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { SendMailInput } from '@infra-common';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTI_SERVICE')
    private notificationService: ClientProxy,
  ) {}

  sendMail(payload: SendMailInput): Observable<any> {
    return this.notificationService.emit('send_mail', payload);
  }
}
