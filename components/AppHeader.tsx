import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { VscMenu } from "react-icons/vsc";
import { BaseHeader } from "./common/BaseHeader";
import { IconButton } from "./common/IconButton";

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

const Title = styled.strong`
  margin: auto;
  font-size: ${(props) => props.theme.fontSize[5]};
`;

export const AppHeader = ({ onMenuClick }: AppHeaderProps) => {
  return (
    <Container passStyle={{ padding: "15px 20px", backgroundColor: "white" }}>
      <IconButton onClick={onMenuClick}>
        <VscMenu size={25} />
      </IconButton>
      <Title>
        <Link href={"/"}>
          <a>Mayt</a>
        </Link>
      </Title>
    </Container>
  );
};
