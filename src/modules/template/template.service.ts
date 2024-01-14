import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IResponseType } from '@infra-common/interfaces';
import { MESSAGE_CODE } from '@infra-common/constants';
import {
  DELAY_ACTION_SCHEMA_NAME,
  EMAIL_CHANNEL_SCHEMA_NAME,
  PUSH_CHANNEL_SCHEMA_NAME,
  SMS_CHANNEL_SCHEMA_NAME,
  Template,
  Workflow,
} from '@database/mongo/schemas';

import {
  CreateTemplateBodyDto,
  UpdateTemplateBodyDto,
  ListTemplateQueryDto,
  ListTemplateResponseDto,
  CreateTemplateResponseDto,
  WorkflowStep,
} from './dtos';
import { WORKFLOW_TYPE } from '@common';
import { WorkflowChannel, WorkflowStatus, WorkflowType } from '@database/enums';
import { PageDto, PageMetaDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel(Template.name)
    private readonly templateModel: Model<Template>,
    @InjectModel(Workflow.name)
    private readonly workflowModel: Model<Workflow>,
  ) {}

  async create(
    payload: CreateTemplateBodyDto,
    userId: string,
  ): Promise<IResponseType<CreateTemplateResponseDto>> {
    const template = await this.templateModel
      .findOne({
        name: payload.name,
        userId,
      })
      .select('_id')
      .lean();

    if (template) {
      throw new HttpException('Name already exists', HttpStatus.BAD_REQUEST);
    }

    const newTemplate = await this.templateModel.create({ ...payload, userId });

    if (payload.steps) {
      await this.createWorkflow(payload.steps, newTemplate);
    }

    return { data: newTemplate, code: MESSAGE_CODE.ACTIONS.CREATE_SUCCESS };
  }

  async createWorkflow(steps: WorkflowStep[], template: Template) {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const isAction = WORKFLOW_TYPE['actions'].includes(step.id);

      const channelType = {
        [WorkflowChannel.DELAY]: DELAY_ACTION_SCHEMA_NAME,
        [WorkflowChannel.EMAIL]: EMAIL_CHANNEL_SCHEMA_NAME,
        [WorkflowChannel.PUSH]: PUSH_CHANNEL_SCHEMA_NAME,
        [WorkflowChannel.SMS]: SMS_CHANNEL_SCHEMA_NAME,
      };

      const workflowData: Partial<Workflow> = {
        name: step.label,
        type: isAction ? WorkflowType.ACTION : WorkflowType.CHANNEL,
        channel: channelType[step.id as WorkflowChannel] as string,
        status: WorkflowStatus.ACTIVE,
        templateId: template._id,
        order: i + 1,
      };

      await this.workflowModel.create(workflowData);
    }
  }

  async update(
    payload: UpdateTemplateBodyDto,
    id: string,
  ): Promise<IResponseType<boolean>> {
    const template = await this.templateModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!template) {
      throw new HttpException('Template not found', HttpStatus.NOT_FOUND);
    }
    return { data: true, code: MESSAGE_CODE.ACTIONS.UPDATE_SUCCESS };
  }

  async delete(id: string, userId: string): Promise<IResponseType> {
    const templateDeleted = await this.templateModel.findOneAndDelete({
      _id: id,
      userId,
    });
    if (!templateDeleted) {
      return {
        message: 'Delete template failed',
        code: MESSAGE_CODE.ACTIONS.DELETE_FAILED,
      };
    }

    await this.workflowModel.deleteMany({ templateId: id });

    return {
      message: 'Delete template success',
      code: MESSAGE_CODE.ACTIONS.DELETE_SUCCESS,
    };
  }

  async getTemplateById(
    id: string,
    userId: string,
  ): Promise<IResponseType<Template>> {
    const template = await this.templateModel
      .findOne({ _id: id, userId })
      .lean();

    if (!template) {
      throw new HttpException('Template not found', HttpStatus.NOT_FOUND);
    }
    return { data: template, code: MESSAGE_CODE.SUCCESS };
  }

  async getListTemplates(
    query: ListTemplateQueryDto,
    userId: string,
  ): Promise<IResponseType<PageDto<ListTemplateResponseDto>>> {
    const templates = await this.templateModel
      .find({ userId })
      .skip(query.skip)
      .limit(query.limit)
      .lean();

    const totalRecord = await this.templateModel.countDocuments({ userId });

    const pageMeta = new PageMetaDto({
      totalRecord,
      pageOptionsDto: query,
    });
    const pageData = new PageDto(templates, pageMeta);

    return { data: pageData };
  }
}
