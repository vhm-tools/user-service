import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { SendMailPayload } from '@infra-common/dtos';
import { NotificationEvents } from '@infra-common/enums';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTI_SERVICE')
    private notificationService: ClientProxy,
  ) {}

  sendMail(payload: SendMailPayload): Observable<any> {
    return this.notificationService.emit(NotificationEvents.SEND_MAIL, payload);
  }
}
