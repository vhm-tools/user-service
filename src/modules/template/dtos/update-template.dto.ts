import { PartialType } from '@nestjs/swagger';
import { CreateTemplateBodyDto } from './create-template.dto';

export class UpdateTemplateBodyDto extends PartialType(CreateTemplateBodyDto) {}
