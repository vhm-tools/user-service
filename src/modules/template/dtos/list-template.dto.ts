import { ApiPropertyOptional, ApiResponseProperty } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/pagination.dto';

export class ListTemplateQueryDto extends PageOptionsDto {
  @ApiPropertyOptional({ example: 'template' })
  keyword: string;
}

export class ListTemplateResponseDto {
  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  flows: string;

  @ApiResponseProperty()
  description: string;
}
