// create-document.dto.ts

import { IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  title: string;

  @IsBoolean()
  state: boolean;
  @IsNotEmpty()
  userEmail: string;
}
