import { IsNotEmpty } from 'class-validator';

export class WorkspaceDto {
@IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;

}
