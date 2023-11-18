import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import {
  DelayAction,
  DelayActionSchema,
  EmailChannel,
  EmailChannelSchema,
  PushChannel,
  PushChannelSchema,
  SmsChannel,
  SmsChannelSchema,
  Template,
  TemplateSchema,
} from '@database/mongo/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Template.name,
        schema: TemplateSchema,
        discriminators: [
          { name: EmailChannel.name, schema: EmailChannelSchema },
          { name: PushChannel.name, schema: PushChannelSchema },
          { name: SmsChannel.name, schema: SmsChannelSchema },
          { name: DelayAction.name, schema: DelayActionSchema },
        ],
      },
    ]),
  ],
  controllers: [TemplateController],
  providers: [TemplateService],
})
export class TemplateModule {}
