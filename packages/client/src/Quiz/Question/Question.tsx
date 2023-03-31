import { MouseEvent } from 'react';
import { IQuestion } from '../../Types/IQuestion';
import {
  AnswerButton,
  AnswerContainer,
  CodeBlock,
  Container,
  Exit,
  FileName,
  Top,
} from './Question.styles';

interface QuestionProps {
  question: IQuestion;
  current: number;
  handleAnswer: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const Question = ({
  question,
  current,
  handleAnswer,
}: QuestionProps) => (
  <Container>
    <Top>
      <FileName>
        {current}/10 - {question.fileName}
      </FileName>
      <Exit to="/">X</Exit>
    </Top>
    <CodeBlock>{question.content}</CodeBlock>
    <AnswerContainer>
      {question.answers &&
        question.answers.map((ans) => (
          <AnswerButton value={ans} key={ans} onClick={handleAnswer}>
            {ans}
          </AnswerButton>
        ))}
    </AnswerContainer>
  </Container>
);
