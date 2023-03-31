import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Patch,
  Post,
} from '@nestjs/common';
import { AnswerDto } from './answer.dto';
import { QuestionsNotReadyError } from './question.errors';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  async getQuestions() {
    try {
      const questions = await this.questionService.getQuestions();
      return questions;
    } catch (error) {
      if (error instanceof QuestionsNotReadyError)
        throw new NotFoundException(error.message);
      throw error;
    }
  }

  @Post('answers')
  async checkAnswers(@Body() answersDto: AnswerDto[]) {
    return await this.questionService.checkAnswers(answersDto);
  }

  @Patch()
  async resetAll() {
    return await this.questionService.resetAll();
  }

  @Delete()
  async deleteAll() {
    return await this.questionService.deleteAll();
  }
}
