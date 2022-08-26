import styled from "styled-components";
import BaseTextInput from "./BaseTextInput";

const RaisedTextInput = styled(BaseTextInput)`
  transition: all 100ms linear;
  box-shadow: rgba(0, 0, 0, 0.4) 0 2px 4px, rgba(0, 0, 0, 0.3) 0 7px 13px -3px,
    rgba(44, 69, 107, 0.28) -3px -4px 0px inset;
  width: 300px;

  &:hover {
    background-color: ${(props) => props.theme.color.grey[200]};
    box-shadow: rgba(0, 0, 0, 0.4) 0 1px 2px, rgba(0, 0, 0, 0.3) 0 5px 7px -3px,
      rgba(44, 69, 107, 0.28) -3px -4px 0px inset;
  }
`;

export default RaisedTextInput;
