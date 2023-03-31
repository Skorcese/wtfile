import axios from 'axios';
import { IAnswerDto } from './Types/IAnswerDto';

const URL = 'http://172.28.124.121:3001';

const axiosInstance = axios.create({ baseURL: URL });

export const getQuestions = async () => {
  const { data } = await axiosInstance.get('/question');
  return data;
};

export const postAnswers = async (answers: IAnswerDto[]) => {
  const { data } = await axiosInstance.post('/question/answers', answers);
  return data;
};
