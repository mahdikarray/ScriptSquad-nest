import { IsNotEmpty, IsBoolean } from 'class-validator';
export class CreateEditorDto {
  @IsNotEmpty()
    readonly title: string;
    @IsNotEmpty()
    readonly data: any; // Adjust the type based on your data structure
  }
  
  export class UpdateEditorDto {
    @IsNotEmpty()
    readonly data: any; // Adjust the type based on your data structure
  }
  