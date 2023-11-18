import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Get,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserAuth } from '@common';
import { IResponseType } from '@infra-common/interfaces';
import env from '@environments';

import { Template } from '@database/mongo/schemas';
import { CreateTemplateDto, UpdateTemplateDto } from './dtos';
import { TemplateService } from './template.service';
import { AuthPayload } from '../auth/dtos';

@Controller({
  path: 'templates',
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
  ): Promise<IResponseType<Template>> {
    return this.templateService.create(payload, user.sub);
  }

  @Patch('update')
  @HttpCode(HttpStatus.OK)
  update(
    @Body() payload: UpdateTemplateDto,
    @UserAuth() user: AuthPayload,
  ): Promise<IResponseType<Template>> {
    return this.templateService.update(user.sub, payload);
  }

  @Delete('delete/:templateId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('templateId') templateId: string,
    @UserAuth() user: AuthPayload,
  ): Promise<IResponseType> {
    return this.templateService.delete(templateId, user.sub);
  }

  @Get(':templateId')
  @HttpCode(HttpStatus.OK)
  getTemplateById(
    @Param('templateId') templateId: string,
    @UserAuth() user: AuthPayload,
  ): Promise<IResponseType<Template>> {
    return this.templateService.getTemplateById(templateId, user.sub);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getListTemplates(
    @UserAuth() user: AuthPayload,
  ): Promise<IResponseType<Template[]>> {
    return this.templateService.getListTemplates(user.sub);
  }
}
