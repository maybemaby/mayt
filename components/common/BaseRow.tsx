import styled from "styled-components";
import { CommonStyle } from "../../lib/types/CommonStyle";

const BaseRow = styled.div<CommonStyle>`
  display: flex;
  flex-direction: row;
  padding: ${(props) => props.padding};
  margin: ${(props) => props.margin};
  width: ${(props) => props.width};
  gap: 15px;
`;

export default BaseRow;
