import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorkspaceDocument = Workspace & Document;

@Schema()
export class Workspace {

  @Prop()
  name: string;

  @Prop()
  code: string;

  
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
