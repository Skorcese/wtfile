import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    html {
        font-size: 62.5%;
    }

    body {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        background: #282b34;
        color: #f0f2f7;
        font-family: system-ui;
        font-size: 1.6rem;
    }
`;
