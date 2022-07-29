import React from "react";
import styled from "styled-components";
import { CommonStyle } from "../../lib/types/CommonStyle";

type BaseHeaderProps = {
  children: React.ReactNode;
  className?: string;
  passStyle?: CommonStyle;
};

const Header = styled.header<CommonStyle>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${(props) => props.padding};
  color: ${(props) => props.color ?? props.theme.color.grey[100]};
  background-color: ${(props) =>
    props.backgroundColor ?? props.theme.color.primary[400]};
`;

export const BaseHeader = ({
  children,
  passStyle,
  className,
}: BaseHeaderProps) => {
  return (
    <Header className={className} {...passStyle}>
      {children}
    </Header>
  );
};
