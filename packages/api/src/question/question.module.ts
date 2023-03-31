import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionController } from './question.controller';
import { QuestionModelDefinition } from './question.schema';
import { QuestionService } from './question.service';

@Module({
  imports: [MongooseModule.forFeature([QuestionModelDefinition])],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
