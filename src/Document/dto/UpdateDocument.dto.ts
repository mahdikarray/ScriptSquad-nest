export class UpdateDocumentDto {
  name?: string;
  
  versionHistory?: string;
  
  title?: string;
  
  state?: boolean;

  createdAt?: Date;

  updatedAt?: Date;
}