import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import env from '@environments';

@Controller(`v${env.API_VERSION}/template`)
@ApiTags('Template')
export class TemplateController {
  @Post('create')
  @HttpCode(HttpStatus.ACCEPTED)
  sendMail(@Body() payload: any): Promise<any> {
    return Promise.resolve(payload);
  }
}
