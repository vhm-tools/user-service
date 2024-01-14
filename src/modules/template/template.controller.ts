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
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserAuth } from '@common';
import { IResponseType } from '@infra-common/interfaces';
import env from '@environments';

import {
  CreateTemplateBodyDto,
  UpdateTemplateBodyDto,
  ListTemplateResponseDto,
  ListTemplateQueryDto,
  GetTemplateResponseDto,
  CreateTemplateResponseDto,
} from './dtos';
import { TemplateService } from './template.service';
import { AuthPayload } from '../auth/dtos';
import { PageDto } from 'src/common/dtos/pagination.dto';

@Controller({
  path: 'templates',
  version: env.API_VERSION,
})
@ApiTags('Template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CreateTemplateResponseDto })
  create(
    @Body() payload: CreateTemplateBodyDto,
    @UserAuth() user: AuthPayload,
  ): Promise<IResponseType<CreateTemplateResponseDto>> {
    return this.templateService.create(payload, user.sub);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  update(
    @Body() payload: UpdateTemplateBodyDto,
    @UserAuth() user: AuthPayload,
  ): Promise<IResponseType<boolean>> {
    return this.templateService.update(payload, user.sub);
  }

  @Delete(':templateId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('templateId') templateId: string,
    @UserAuth() user: AuthPayload,
  ): Promise<IResponseType> {
    return this.templateService.delete(templateId, user.sub);
  }

  @Get(':templateId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GetTemplateResponseDto })
  getTemplateById(
    @Param('templateId') templateId: string,
    @UserAuth() user: AuthPayload,
  ): Promise<IResponseType<GetTemplateResponseDto>> {
    return this.templateService.getTemplateById(templateId, user.sub);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PageDto<ListTemplateResponseDto> })
  getListTemplates(
    @Query() query: ListTemplateQueryDto,
    @UserAuth() user: AuthPayload,
  ): Promise<IResponseType<PageDto<ListTemplateResponseDto>>> {
    return this.templateService.getListTemplates(query, user.sub);
  }
}
