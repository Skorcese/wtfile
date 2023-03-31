import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ButtonString } from './Button.style';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
`;

export const Title = styled.h1`
  font-family: consolas;
  font-size: 36px;
  text-align: center;
`;

export const Content = styled.p`
  font-family: consolas;
  margin: 16px 0;
  text-align: center;
`;

export const Button = styled(Link)`
  width: 200px;
  align-self: center;
  ${ButtonString}
`;
