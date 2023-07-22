import styled, { css } from "styled-components";

export const StyledOfferCard = styled.div<{ disabled: boolean; noActions: boolean; ownOffer: boolean; isReserving: boolean }>(
  ({ disabled, noActions, ownOffer, isReserving }) => css`
    position: relative;
    overflow: hidden;

    .offer-card {
      ${!ownOffer &&
      css`
        cursor: pointer;

        &:hover {
          background-color: #f5f5f5;
        }
      `}

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

    ${isReserving &&
    css`
      &::after {
        display: flex;
        align-items: center;
        justify-content: center;
        content: "Reserving...";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color: white;
        background-color: rgba(0, 0, 0, 0.8);
        border-radius: 10px;
        cursor: not-allowed;
        font-weight: 700;
      }
    `}
  `
);
