import React from "react";
import styled from "styled-components";
import { CommonStyle } from "../../lib/types/CommonStyle";

type BaseSidebarProps = {
  passStyle?: CommonStyle;
  children: React.ReactNode;
};

const Container = styled.div<CommonStyle>`
  display: flex;
  flex-direction: column;
  color: ${(props) => props.color ?? props.theme.color.primary[500]};
  background-color: ${(props) =>
    props.backgroundColor ?? props.theme.color.grey[300]};
  padding: ${(props) => props.padding};

  @media screen and (min-width: 768px) {
    position: fixed;
    left: 0;
    height: 100%;
    overflow: auto;
    min-width: 200px;
    width: fit-content;
  }
`;

export const BaseSidebar = ({ passStyle, children }: BaseSidebarProps) => {
  return <Container {...passStyle}>{children}</Container>;
};
