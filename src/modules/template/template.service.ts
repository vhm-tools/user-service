import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Template } from '@database/mongo/schemas';
import { CreateTemplateDto } from './dtos';

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel(Template.name)
    private readonly templateModel: Model<Template>,
  ) {}

  async create(payload: CreateTemplateDto, userId: string): Promise<any> {
    // console.log({ payload, userId });
    await Promise.reject(new Error('Something error, promise reject!!'));
  }
}
