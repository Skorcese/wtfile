import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

export type QuestionDocument = Question & Document;
export type QuestionModel = Model<QuestionDocument>;

@Schema()
export class Question {
  @Prop()
  fileName: string;

  @Prop()
  correctAnswer: string;

  @Prop()
  content: string;

  @Prop()
  isActive: boolean;

  @Prop()
  depth: number;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

export const QuestionModelDefinition: ModelDefinition = {
  name: Question.name,
  schema: QuestionSchema,
};
