import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { WorkflowStatus } from '@database/enums';

export class ListWorkflowQueryDto {
  @ApiProperty()
  templateId: string;
}

export class ListWorkflowResponseDto {
  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  order: number;

  @ApiResponseProperty({ enum: WorkflowStatus })
  status: WorkflowStatus;
}
