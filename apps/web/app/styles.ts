import styled from "styled-components";

export const StyledMainApp = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .mobile-container {
    background-color: white;
    border: 2px solid var(--gray-border);
    width: 450px;
    height: 80vh;
    max-height: 800px;
    border-radius: 20px;
  }
`;
