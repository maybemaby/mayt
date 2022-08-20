import styled from "styled-components";
import { CommonStyle } from "../../lib/types/CommonStyle";

const BaseGrid = styled.div<CommonStyle>`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-row-gap: 20px;
  grid-column-gap: 5px;
  justify-content: center;
  justify-items: center;
  align-items: start;
  width: ${(props) => props.width ?? "100%"};
  padding: ${(props) => props.padding};
  margin: ${(props) => props.margin};

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media screen and (min-width: 1440px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

export default BaseGrid;
