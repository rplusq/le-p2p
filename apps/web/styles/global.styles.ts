"use client";

import { createGlobalStyle } from "styled-components";
import { variables } from "./variables.styles";

export const GlobalStyle = createGlobalStyle`
    ${variables}
    
    *,
    *::before,
    *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    html {
        color: var(--white);
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    
    -webkit-scrollbar {
        display: none;
    }
    
    ::-webkit-scrollbar {
        width: 0;
        background: transparent;
    }
    
    body {
        background-color: var(--background);
        margin: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        letter-spacing: 1px;
        overflow: hidden;
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
    }

    h2 {
        font-size: 32px;
    }
`;
