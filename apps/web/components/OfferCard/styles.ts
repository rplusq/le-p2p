import styled, { css } from "styled-components";

export const StyledOfferCard = styled.div<{ disabled: boolean; noActions: boolean }>(
  ({ disabled, noActions }) => css`
    position: relative;
    overflow: hidden;

    .offer-card {
      cursor: pointer;

      &:hover {
        background-color: #f5f5f5;
      }

      ${noActions &&
      css`
        cursor: default;

        &:hover {
          background-color: transparent;
        }
      `}
    }

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
