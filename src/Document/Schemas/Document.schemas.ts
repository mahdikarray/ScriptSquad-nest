import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';
import { Post } from 'src/editor/post.schema';
import {  Schema as MongooseSchema } from 'mongoose';
export interface DocumentVersion {
  versionNumber: number;
  name: string;
  title: string;
  createdAt: Date;
  note?: string;
}

@Schema()
export class Document extends MongooseDocument {
  @Prop()
  name: string;

  @Prop()
  title: string;

  @Prop()
  userEmail: string;

  @Prop({ type: [Object] })
  versionHistory: DocumentVersion[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop()
  note?: string;

 
  @Prop({ type: Buffer }) // Utiliser un type Buffer pour stocker les données du fichier
  data: Buffer;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post' })
  post: Post;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
