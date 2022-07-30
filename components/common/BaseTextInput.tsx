import styled from "styled-components";

const Input = styled.input`
  background-color: white;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.color.grey[600]};
  padding: 7px 20px;
  width: 100%;
  margin: auto;
  font-family: inherit;
  font-weight: 500;
  font-size: ${(props) => props.theme.fontSize[3]};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), -2px 3px 4px rgba(0, 0, 0, 0.25);
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: all 300ms cubic-bezier(0.075, 0.82, 0.165, 1);
`;

export default Input;
