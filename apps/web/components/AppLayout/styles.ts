import styled from "styled-components";

export const StyledAppLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  main {
    padding: 10px;
    flex: 1;
    overflow: auto;
  }
`;

export const StyledBottomNav = styled.nav`
  border-top: 2px solid var(--gray-border);
  padding: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 20px;

  .nav-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    width: 100%;
    padding: 5px 0;
    border-radius: 12px;
    cursor: pointer;

    * {
      transition: 0.2s;
    }

    &.active {
      background: #f1f1f1;
    }

    &:hover {
      opacity: 0.7;
    }

    .icon {
      font-size: 34px;
    }

    p {
      font-size: 14px;
    }
  }
`;

export const StyledAppHeader = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  padding-bottom: 5px;
`;
