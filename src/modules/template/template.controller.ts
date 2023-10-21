import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IResponseType } from '@share-libs';
import { CreateTemplateDto } from './dtos';
import env from '@environments';

@Controller({
  path: 'template',
  version: env.API_VERSION,
})
@ApiTags('Template')
export class TemplateController {
  @Post('create')
  @HttpCode(HttpStatus.OK)
  create(
    @Body() payload: CreateTemplateDto,
  ): Promise<IResponseType<CreateTemplateDto>> {
    return Promise.resolve({
      data: payload,
    });
  }
}
