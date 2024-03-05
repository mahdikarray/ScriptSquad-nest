import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}
interface PostData {
    time: number;
    blocks: { id: string; type: string; data: { [key: string]: any } }[];
    version: string;
  }
  
  export type PostDocument = Post & Document;
  
  @Schema()
  export class Post {
    @Prop({ required: true })
    title: string;
  
    @Prop({ required: true, type: Object })
    data: PostData; // Use the interface here
    @Prop()
  image: string;
  }
  

export const PostSchema = SchemaFactory.createForClass(Post);
