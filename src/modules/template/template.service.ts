import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IResponseType } from '@infra-common/interfaces';
import { Template } from '@database/mongo/schemas';
import { CreateTemplateDto, UpdateTemplateDto } from './dtos';

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel(Template.name)
    private readonly templateModel: Model<Template>,
  ) {}

  async create(
    payload: CreateTemplateDto,
    userId: string,
  ): Promise<IResponseType<Template>> {
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
    return { data: newTemplate };
  }

  async update(
    id: string,
    payload: UpdateTemplateDto,
  ): Promise<IResponseType<Template>> {
    const template = await this.templateModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!template) {
      throw new HttpException('Template not found', HttpStatus.NOT_FOUND);
    }
    return { data: template };
  }

  async delete(id: string, userId: string): Promise<IResponseType> {
    const templateDeleted = await this.templateModel.findOneAndDelete({
      _id: id,
      userId,
    });
    if (!templateDeleted) {
      return { message: 'Delete template failed' };
    }

    return { message: 'Delete template success' };
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
    return { data: template };
  }

  async getListTemplates(userId: string): Promise<IResponseType<Template[]>> {
    const templates = await this.templateModel.find({ userId }).lean();
    return { data: templates };
  }
}
