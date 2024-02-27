// update-document.dto.ts

import { IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateDocumentDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  title: string;

  @IsBoolean()
  state: boolean;
}
