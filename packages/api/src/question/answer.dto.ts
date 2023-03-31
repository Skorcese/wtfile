import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class AnswerDto {
  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
