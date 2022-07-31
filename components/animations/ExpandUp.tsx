import { keyframes } from "styled-components";

const ExpandUp = keyframes`
  0% {
    transform: translateY(100%) scale(0.5);
    opacity: 0;
  } 100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

export default ExpandUp;
