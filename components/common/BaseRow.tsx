import styled from "styled-components";
import { CommonStyle } from "../../lib/types/CommonStyle";

const BaseRow = styled.div<
  CommonStyle & { justify?: "space-between" | "flex-end" | "space-evenly" }
>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) => props.justify ?? "flex-start"};
  padding: ${(props) => props.padding};
  margin: ${(props) => props.margin};
  width: ${(props) => props.width};
  gap: 15px;
`;

export default BaseRow;
