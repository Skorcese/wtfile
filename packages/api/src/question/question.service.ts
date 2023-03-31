import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'bson';
import { AnswerDto } from './answer.dto';
import {
  QuestionsNotReadyError,
  UnexpectedQuestionsLengthError,
} from './question.errors';
import { Question, QuestionDocument, QuestionModel } from './question.schema';

interface ICheckedAnswer {
  answer: string;
  id: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface CheckedAnswers {
  points: number;
  checkedAnswers: ICheckedAnswer[];
}

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: QuestionModel,
  ) {}

  async getQuestions(): Promise<
    {
      _id: string;
      fileName: string;
      answers: string[];
      content: string;
    }[]
  > {
    const aggregateRandomQuestions = await this.questionModel.aggregate([
      { $match: { isActive: true } },
      {
        $sample: { size: 100 },
      },
      {
        $group: {
          _id: '$_id',
          document: { $push: '$$ROOT' },
        },
      },
      {
        $limit: 10,
      },
      {
        $unwind: '$document',
      },
    ]);

    const unwrapAggregate = ({ _id, document }) => ({ _id, ...document });

    const questions: QuestionDocument[] =
      aggregateRandomQuestions.map(unwrapAggregate);

    if (questions.length !== 10) throw new QuestionsNotReadyError();

    const distinctAnswers = await this.questionModel.distinct('correctAnswer');
    const questionsWithAnswers = questions.map(
      ({ _id, fileName, correctAnswer, content }) => {
        const distinctAnswersWithoutCorrectOne = distinctAnswers.filter(
          (answer) => answer !== correctAnswer,
        );

        const answers = this.shuffleArray(
          distinctAnswersWithoutCorrectOne,
        ).slice(0, 3);

        answers.push(correctAnswer);
        this.shuffleArray(answers);

        return {
          _id,
          fileName,
          answers,
          content,
        };
      },
    );

    return questionsWithAnswers;
  }

  async checkAnswers(answers: AnswerDto[]): Promise<CheckedAnswers> {
    const questionsIds = answers.map(({ id }) => new ObjectId(id));
    const questions = await this.questionModel.find({
      _id: { $in: questionsIds },
    });

    if (questions.length !== 10)
      throw new UnexpectedQuestionsLengthError(questions.length);

    await this.questionModel.updateMany(
      { _id: { $in: questionsIds } },
      { isActive: false },
    );

    const checkedAnswers: ICheckedAnswer[] = [];

    for (const { answer, id } of answers) {
      const { correctAnswer } = questions.find(({ _id }) => _id.equals(id));
      checkedAnswers.push({
        answer,
        id,
        correctAnswer,
        isCorrect: answer === correctAnswer,
      });
    }

    const points: number = checkedAnswers.reduce(
      (score, { isCorrect }) => (isCorrect ? score + 1 : score),
      0,
    );

    return { points, checkedAnswers };
  }

  async resetAll() {
    await this.questionModel.updateMany(
      { isActive: false },
      { isActive: true },
    );
  }

  async deleteAll() {
    await this.questionModel.deleteMany({});
  }

  private shuffleArray(arr: string[]) {
    return arr.sort(() => 0.5 - Math.random());
  }
}
