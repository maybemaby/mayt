import styled from "styled-components";
import { CommonStyle } from "../../lib/types/CommonStyle";

const BaseBlockButton = styled.button<CommonStyle>`
  font-family: inherit;
  padding: ${(props) => props.padding ?? "5px"};
  margin: ${(props) => props.margin};
  color: ${(props) => props.color ?? "white"};
  border-radius: ${(props) => props.borderRadius};
  background-color: ${(props) =>
    props.backgroundColor ?? props.theme.color.primary[400]};
  transition: background-color 300ms ease;
  width: ${(props) => props.width ?? "fit-content"};
  border: none;

  &:hover,
  &:active {
    cursor: pointer;
    background-color: ${(props) =>
      props.backgroundColor ?? props.theme.color.primary[500]};
  }
`;

export default BaseBlockButton;
