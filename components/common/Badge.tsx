import styled from "styled-components";

interface BadgeProps {
  fill?: string;
  stroke?: string;
}

const Badge = styled.div<BadgeProps>`
  display: flex;
  justify-content: center;
  border: 2px solid ${(props) => props.stroke ?? props.theme.color.primary[300]};
  background: ${(props) => props.fill ?? "transparent"};
  color: ${(props) => props.stroke ?? props.theme.color.primary[500]};
  border-radius: 20px;
  min-height: 20px;
  min-width: 50px;
  padding: 5px;
  transition: background-color 300ms ease;

  &:hover {
    background: ${(props) => props.theme.color.grey[400]};
  }
`;

export const ButtonBadge = styled.button<BadgeProps>`
  font-size: 1rem;
  font-family: "Nunito", Oxygen, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid ${(props) => props.stroke ?? props.theme.color.primary[300]};
  background: ${(props) => props.fill ?? "transparent"};
  color: ${(props) => props.stroke ?? props.theme.color.primary[500]};
  border-radius: 20px;
  min-height: 20px;
  min-width: 50px;
  padding: 5px 10px;
  transition: background-color 300ms ease;

  &:hover,
  &:focus-within {
    background: ${(props) => props.theme.color.grey[300]};
    cursor: pointer;
  }
`;

export default Badge;
