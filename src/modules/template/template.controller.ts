import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserAuth } from '@common';
import { IResponseType } from '@infra-common/interfaces';
import env from '@environments';

import { CreateTemplateDto } from './dtos';
import { TemplateService } from './template.service';
import { AuthPayload } from '../auth/dtos';

@Controller({
  path: 'template',
  version: env.API_VERSION,
})
@ApiTags('Template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  create(
    @Body() payload: CreateTemplateDto,
    @UserAuth() user: AuthPayload,
  ): Promise<IResponseType<CreateTemplateDto>> {
    return this.templateService.create(payload, user.sub);
  }
}
