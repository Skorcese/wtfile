import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ButtonString } from '../../Button.style';

const PADDING = 'padding: 0 12px;';

export const Container = styled.div`
  ${PADDING}
  font-family: consolas;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 768px) {
    padding: 0 128px;
  }
  @media screen and (min-width: 1024px) {
    padding: 0 256px;
  }
  @media screen and (min-width: 1200px) {
    padding: 0 384px;
  }
`;

export const Title = styled.h1`
  animation-duration: 1s;
  animation-name: slidein;

  @keyframes slidein {
    from {
      margin-left: 100%;
      width: 300%;
    }

    to {
      margin-left: 0%;
      width: 100%;
    }
  }
`;

export const Points = styled.h3`
  text-align: center;
  font-size: 36px;
  margin: 24px 0;
`;

export const CheckedAnswer = styled.p`
  margin: 8px 0;
  padding: 0;
`;

export const Exit = styled(Link)`
  ${ButtonString}
  margin: 24px auto;
  justify-self: center;
  align-self: center;
`;
