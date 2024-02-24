import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  Schema as MongooseSchema } from 'mongoose';
import { Post } from '../../editor/post.schema'; // Import the Post schema
@Schema()
export class Document {
    @Prop({ required: true })
    name: string;

    @Prop()
    versionHistory: string;

    @Prop()
    title: string;

    @Prop()
    state: boolean;

    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: Date })
    updatedAt: Date;
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post' })
  post: Post;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
