import React from "react";
import styled, { keyframes, css } from "styled-components";
import { CommonStyle } from "../../lib/types/CommonStyle";

type BaseSidebarProps = {
  passStyle?: CommonStyle;
  children: React.ReactNode;
  zIndex?: number;
  forceShow: boolean;
};

const slideRight = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0%);
  }
`;

const Container = styled.div<
  CommonStyle & { zIndex?: number; forceShow: boolean }
>`
  flex-direction: column;
  color: ${(props) => props.color ?? props.theme.color.primary[500]};
  background-color: ${(props) =>
    props.backgroundColor ?? props.theme.color.grey[300]};
  padding: ${(props) => props.padding};
  z-index: ${(props) => props.zIndex ?? 5};
  border-right: 2px solid ${(props) => props.theme.color.primary[600]};
  display: ${(props) => (props.forceShow ? "flex" : "none")};
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  overflow: auto;
  min-width: 200px;
  width: fit-content;
  animation: ${(props) =>
    props.forceShow
      ? css`
          ${slideRight} 200ms ease
        `
      : "none"};

  @media screen and (min-width: 768px) {
    display: flex;
  }
`;

export const BaseSidebar = ({
  passStyle,
  children,
  zIndex,
  forceShow = false,
}: BaseSidebarProps) => {
  return (
    <Container {...passStyle} zIndex={zIndex} forceShow={forceShow}>
      {children}
    </Container>
  );
};
