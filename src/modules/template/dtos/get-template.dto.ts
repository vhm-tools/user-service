import { ApiResponseProperty } from '@nestjs/swagger';

export class GetTemplateResponseDto {
  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  flows: string;

  @ApiResponseProperty()
  description: string;
}
