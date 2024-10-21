import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Student extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  studentCode: string;

  @Prop({ default: false })
  isActive: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);