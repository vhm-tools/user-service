import { ApiResponseProperty } from '@nestjs/swagger';

export class GetTemplateResponseDto {
  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  description: string;
}
