import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from '../Document/Schemas/Document.schemas';

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
  }
  

export const PostSchema = SchemaFactory.createForClass(Post);
