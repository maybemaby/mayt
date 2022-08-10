import styled, { keyframes } from "styled-components";

type LoaderProps = {
  height?: string;
  width?: string;
  color?: string;
};

const LoaderAnimation = keyframes`
  0%   { height: 48px}
  100% { height: 4px}
`;

const Loader = styled.span<LoaderProps>`
  width: ${(props) => props.width ?? "8px"};
  height: ${(props) => props.height ?? "40px"};
  border-radius: 4px;
  display: block;
  margin: 20px auto;
  position: relative;
  background: currentColor;
  color: ${(props) => props.color ?? props.theme.color.primary[100]};
  box-sizing: border-box;
  animation: ${LoaderAnimation} 0.3s 0.3s linear infinite alternate;

  &::after,
  &::before {
    content: "";
    width: ${(props) => props.width ?? "8px"};
    height: ${(props) => props.height ?? "40px"};
    border-radius: 4px;
    background: currentColor;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 20px;
    box-sizing: border-box;
    animation: ${LoaderAnimation} 0.3s 0.45s linear infinite alternate;
  }

  &::before {
    left: -20px;
    animation-delay: 0s;
  }
`;

const BarLoader = (props: LoaderProps) => {
  return (
    <>
      <Loader {...props} />
    </>
  );
};

export default BarLoader;
