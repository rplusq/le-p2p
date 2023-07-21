import styled from "styled-components";

export const StyledAppLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  main {
    padding: 15px;
    flex: 1;
  }
`;

export const StyledBottomNav = styled.nav`
  border-top: 2px solid var(--gray-border);
  padding: 15px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .nav-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    transition: 0.2s;

    &.active {
      color: var(--primary);
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
