import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Task {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop()
    status: string; // Can be 'todo', 'inProgress', 'done', etc.

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
