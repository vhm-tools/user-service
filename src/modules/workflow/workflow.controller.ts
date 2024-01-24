import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { WorkflowService } from './workflow.service';
import { IResponseType } from '@infra-common/interfaces';
import { ListWorkflowQueryDto, ListWorkflowResponseDto } from './dtos';
import env from '@environments';

@Controller({
  path: 'workflows',
  version: env.API_VERSION,
})
@ApiTags('Workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListWorkflowResponseDto })
  getListWorkflows(
    @Query() query: ListWorkflowQueryDto,
  ): Promise<IResponseType<ListWorkflowResponseDto>> {
    return this.workflowService.getListWorkflows(query);
  }
}
