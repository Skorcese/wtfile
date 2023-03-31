export interface ICheckedAnswers {
  points: number;
  checkedAnswers: {
    answer: string;
    id: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}
