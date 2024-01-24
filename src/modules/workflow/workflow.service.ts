import { Injectable } from '@nestjs/common';
import { IResponseType } from '@infra-common/interfaces';
import { ListWorkflowQueryDto, ListWorkflowResponseDto } from './dtos';
import { InjectModel } from '@nestjs/mongoose';
import { Workflow } from '@database/mongo/schemas';
import { Model } from 'mongoose';

@Injectable()
export class WorkflowService {
  constructor(
    @InjectModel(Workflow.name)
    private readonly workflowModel: Model<Workflow>,
  ) {}

  async getListWorkflows(
    query: ListWorkflowQueryDto,
  ): Promise<IResponseType<ListWorkflowResponseDto>> {
    const workflows = await this.workflowModel
      .find({
        templateId: query.templateId,
      })
      .select('_id name status')
      .lean();

    return { data: workflows };
  }
}
