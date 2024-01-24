import { PartialType, PickType } from '@nestjs/swagger';
import { CreateTemplateBodyDto } from './create-template.dto';

export class UpdateTemplateBodyDto extends PartialType(
  PickType(CreateTemplateBodyDto, ['name', 'description'] as const),
) {}
