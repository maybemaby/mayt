import { keyframes } from "styled-components";

const PopIn = keyframes`
0% {
  opacity: 0;
  transform: scale(0);
} 80% {
  opacity: 0.8;
  transform: scale(1.1);
} 100% {
  opacit: 1;
  transform: scale(1);
}
`;

export default PopIn;
