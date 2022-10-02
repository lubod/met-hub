/* eslint-disable import/prefer-default-export */
import styled from "styled-components";

export const LoadImg = styled.img<{ rotate: boolean }>`
  animation: ${(props) => (props.rotate ? "rotation 2s infinite linear" : "")};

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
