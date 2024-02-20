import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
