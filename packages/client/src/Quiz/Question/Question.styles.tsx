import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ButtonString } from '../../Button.style';

const PADDING = 'padding: 0 12px;';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`;

export const Top = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
`;

export const Exit = styled(Link)`
  ${ButtonString}
  margin: 0 12px;
`;

export const FileName = styled.h3`
  margin: 12px 0;
  ${PADDING}
  font-family: Consolas;
`;

export const CodeBlock = styled.pre`
  background: black;
  font-family: Consolas;
  font-weight: bold;
  font-size: 12px;
  color: #2a9c1a;
  margin: 4px 12px;
  ${PADDING}
  border-radius: 4px;
  overflow: auto;
  flex-grow: 1;
`;

export const AnswerContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 12px;
  margin: 16px 0;
  ${PADDING}
`;

export const AnswerButton = styled.button`
  ${ButtonString}
`;
