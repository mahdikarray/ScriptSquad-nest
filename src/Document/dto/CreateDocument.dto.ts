import { IsNotEmpty } from 'class-validator';
import { Date } from 'mongoose';

export class CreateDocumentDto {
  @IsNotEmpty()
  name: string;

  versionHistory: string;

  title: string;

  state: boolean;
  
  createdAt: Date;
  
  updatedAt: Date;
}
