export class QuestionsNotReadyError extends Error {
  constructor() {
    super('Questions are not ready yet...');
  }
}
export class UnexpectedQuestionsLengthError extends Error {
  constructor(length: number) {
    super(`Unexpected number of questions: ${length}`);
  }
}
