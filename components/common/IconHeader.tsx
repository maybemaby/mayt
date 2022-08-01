import { ReactNode } from "react";
import styled from "styled-components";
import type { IconType, IconBaseProps } from "react-icons";

type IconHeaderProps = {
  Icon: IconType;
  iconProps?: IconBaseProps;
  className?: string;
  children: ReactNode;
};

const Container = styled.div`
  font-family: Poppins, Fira Sans, Segoe UI, sans-serif;
  text-decoration: underline;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: ${({ theme }) => theme.fontSize[3]};
  font-weight: ${({ theme }) => theme.fontWeights.subtitle};
`;

const IconHeader = ({
  Icon,
  iconProps,
  children,
  className,
}: IconHeaderProps) => {
  return (
    <Container className={className}>
      <Icon {...iconProps} color={iconProps?.color ?? "#679BE8"} />
      {children}
    </Container>
  );
};

export default IconHeader;
