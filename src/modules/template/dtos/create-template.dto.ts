import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';

export class WorkflowStep {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  label: string;
}

export class CreateTemplateBodyDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  flows: string;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  steps: WorkflowStep[];
}

export class CreateTemplateResponseDto {
  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  flows: string;

  @ApiResponseProperty()
  description: string;
}
