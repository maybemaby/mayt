import styled from "styled-components";
import BaseBlockButton from "./BaseBlockButton";

const RaisedBlockButton = styled(BaseBlockButton)`
  font-family: inherit;
  background-color: transparent;
  font-size: 1.2rem;
  padding: 10px;
  border-radius: 5px;
  color: ${(props) => props.theme.color.primary[600]};
  width: 100px;
  font-weight: ${(props) => props.theme.fontWeights.subtitle};
  transition: all 100ms linear;
  box-shadow: rgba(0, 0, 0, 0.4) 0 2px 4px, rgba(0, 0, 0, 0.3) 0 7px 13px -3px,
    rgba(44, 69, 107, 0.28) -3px -4px 0px inset;

  &:hover {
    background-color: ${(props) => props.theme.color.grey[200]};
    box-shadow: rgba(0, 0, 0, 0.4) 0 1px 2px, rgba(0, 0, 0, 0.3) 0 5px 7px -3px,
      rgba(44, 69, 107, 0.28) -3px -4px 0px inset;
  }

  &:active {
    box-shadow: rgba(0, 0, 0, 0.4) 0 1px 2px, rgba(0, 0, 0, 0.3) 0 5px 7px -3px,
      rgba(44, 69, 107, 0.28) -1px -1px 0px inset;
    transform: scale(0.97);
  }
`;

export default RaisedBlockButton;
