import { useState, useRef } from "react";
import styled from "styled-components";
import { usePopper } from "react-popper";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IconButton } from "./common/IconButton";
import useOnClickOutside from "../hooks/useOnClickOutside";
import PopIn from "./animations/PopIn";

type MenuProps = {
  iconSize?: number;
};

const MenuButton = styled(IconButton)`
  border-radius: 50%;
  background-color: transparent;
  transition: background-color 200ms ease;
  height: fit-content;
  aspect-ratio: 1/1;

  &:hover {
    background-color: ${(props) => props.theme.color.grey[200]};
  }
`;

const MenuContainer = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? "flex" : "none")};
  flex-direction: column;
  background-color: ${(props) => props.theme.color.grey[200]};
  border: 2px solid ${(props) => props.theme.color.grey[500]};
  padding: 10px;
  border-radius: 10px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  transition: all 500ms ease;

  animation: ${PopIn} 100ms linear;
`;

const Menu = ({ iconSize }: MenuProps) => {
  const [visible, setVisible] = useState(false);
  const refElement = useRef<HTMLButtonElement | null>(null);
  // const [refElement, setRefElement] = useState<HTMLButtonElement | null>(null);
  const popperElement = useRef<HTMLDivElement | null>(null);
  // const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
  //   null
  // );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(
    refElement.current,
    popperElement.current,
    {
      placement: "bottom-end",
      modifiers: [
        { name: "arrow", options: { element: arrowElement } },
        {
          name: "offset",
          enabled: true,
          options: {
            offset: [0, 10],
          },
        },
      ],
    }
  );

  useOnClickOutside(
    popperElement,
    (e) => {
      setVisible(false);
    },
    undefined,
    refElement
  );

  return (
    <>
      <MenuButton
        type="button"
        ref={refElement}
        onClick={(e) => {
          e.stopPropagation();
          setVisible(!visible);
        }}
        aria-haspopup="true"
        aria-controls="menu"
      >
        <BsThreeDotsVertical size={iconSize ?? 20} />
      </MenuButton>

      <div ref={popperElement} style={styles.popper} {...attributes.popper}>
        <MenuContainer visible={visible} role="menu">
          Popper Element
          <div ref={setArrowElement} style={styles.arrow}></div>
        </MenuContainer>
      </div>
    </>
  );
};

export default Menu;
