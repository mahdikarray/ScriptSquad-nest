import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorkspaceDocument = Workspace & Document;

import * as bcrypt from 'bcrypt';

@Schema()
export class Workspace {

  @Prop()
  name: string;

  @Prop()
   code: string;


   async getCode() {
    console.log('Code:', this.code); // Log the value of this.code
    const hashcode = await bcrypt.hash(this.code, 10);
    return hashcode;
  }




  
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
