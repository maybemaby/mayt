import React, { useState } from "react";
import { BsArrowBarLeft } from "react-icons/bs";
import styled, { keyframes, css } from "styled-components";
import { CommonStyle } from "../../lib/types/CommonStyle";
import { IconButton } from "./IconButton";

type BaseSidebarProps = {
  passStyle?: CommonStyle;
  children: React.ReactNode;
  zIndex?: number;
  forceShow: boolean;
  onClose(e?: React.MouseEvent): void;
};

const slideRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0%);
  }
`;

const exitLeft = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateX(-100%);
  }
`;

const Container = styled.nav<
  CommonStyle & { zIndex?: number; forceShow: boolean; closing: boolean }
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
    props.closing
      ? css`
          ${exitLeft} 400ms ease
        `
      : props.forceShow
      ? css`
          ${slideRight} 200ms ease
        `
      : "none"};

  @media screen and (min-width: 768px) {
    display: flex;
  }
`;

const CloseIcon = styled(BsArrowBarLeft)`
  position: absolute;
  top: 20px;
  right: 20px;

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

export const BaseSidebar = ({
  passStyle,
  children,
  zIndex,
  onClose,
  forceShow = false,
}: BaseSidebarProps) => {
  const [closing, setClosing] = useState(false);

  const handleClosing = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 200);
  };

  return (
    <Container
      {...passStyle}
      zIndex={zIndex}
      forceShow={forceShow}
      closing={closing}
    >
      {forceShow && (
        <IconButton onClick={handleClosing}>
          <CloseIcon size={25} />
        </IconButton>
      )}
      {children}
    </Container>
  );
};
