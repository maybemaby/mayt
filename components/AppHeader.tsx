import React from "react";
import styled from "styled-components";
import { BaseHeader } from "./common/BaseHeader";

type AppHeaderProps = {
  onMenuClick(e?: React.MouseEvent): void;
};

const Container = styled(BaseHeader)`
  color: ${(props) => props.theme.color.primary[400]};
  display: flex;
  /* position: absolute;
  top: 0; */
  width: 100%;
  z-index: 2s;

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

export const AppHeader = ({ onMenuClick }: AppHeaderProps) => {
  return (
    <Container passStyle={{ padding: "15px 20px", backgroundColor: "white" }}>
      <button onClick={onMenuClick}>Menu</button>
      Mayt
    </Container>
  );
};
