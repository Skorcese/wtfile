import { useEffect, useState } from 'react';
import { postAnswers } from '../../api';
import { IAnswerDto } from '../../Types/IAnswerDto';
import { ICheckedAnswers } from '../../Types/ICheckedAnswers';
import { CheckedAnswer, Container, Points, Title, Exit } from './Final.styles';

interface FinalProps {
  answers: IAnswerDto[];
  fileNames: string[];
}

export const Final = ({ answers, fileNames }: FinalProps) => {
  const [result, setResult] = useState<ICheckedAnswers>();

  useEffect(() => {
    postAnswers(answers).then((data) => setResult(data));
  }, [answers]);

  return (
    <Container>
      <Title>Your result:</Title>
      <Points>{result ? result.points : '...'}/10</Points>
      {result &&
        result.checkedAnswers.map(
          ({ answer, correctAnswer, isCorrect }, idx) => {
            const symbol = isCorrect ? '✔️' : '❌';
            const fileName = fileNames[idx];
            const ans = isCorrect ? answer : <del>{answer}</del>;
            const shouldBe = !isCorrect && ` 👉 ${correctAnswer}`;

            return (
              <CheckedAnswer key={idx}>
                {symbol} {fileName}
                {ans} {shouldBe}
              </CheckedAnswer>
            );
          }
        )}
      <Exit to="/">X</Exit>
    </Container>
  );
};
