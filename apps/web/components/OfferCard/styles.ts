import styled, { css } from "styled-components";

export const StyledOfferCard = styled.div<{ disabled: boolean }>(
  ({ disabled }) => css`
    position: relative;
    overflow: hidden;

    ${disabled &&
    css`
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.35);
        border-radius: 10px;
        cursor: not-allowed;
      }
    `}
  `
);
