import { useEffect, useState, MouseEvent } from 'react';
import { Question } from './Question/Question';
import { IAnswerDto } from '../Types/IAnswerDto';
import { IQuestion } from '../Types/IQuestion';
import { Final } from './Final/Final';
import { getQuestions } from '../api';

export const Quiz = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [answers, setAnswers] = useState<IAnswerDto[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    getQuestions().then((q) => setQuestions(q));
  }, []);

  useEffect(() => {
    setCurrentQuestionIndex(0);
  }, [questions]);

  const handleAnswer = (e: MouseEvent<HTMLButtonElement>) => {
    const answer = (e.target as HTMLButtonElement)?.value;
    const answerDto = { answer, id: questions[currentQuestionIndex]._id };
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setAnswers([...answers, answerDto]);
  };

  return (
    <>
      {currentQuestionIndex <= 9 ? (
        <Question
          question={questions[currentQuestionIndex] || {}}
          current={currentQuestionIndex + 1}
          handleAnswer={handleAnswer}
        />
      ) : (
        <Final
          answers={answers}
          fileNames={questions.map(({ fileName }) => fileName)}
        />
      )}
    </>
  );
};
