import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { usePopper } from "react-popper";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IconButton } from "./common/IconButton";
import useOnClickOutside from "../hooks/useOnClickOutside";
import PopIn from "./animations/PopIn";

type MenuProps = {
  iconSize?: number;
  options: { label: string; value: string }[];
  onSelect(value: string): void;
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

const MenuContainer = styled.ul<{ visible: boolean }>`
  display: ${(props) => (props.visible ? "flex" : "none")};
  flex-direction: column;
  background-color: ${(props) => props.theme.color.grey[200]};
  border: 2px solid ${(props) => props.theme.color.grey[500]};
  padding: 0px;
  border-radius: 10px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  transition: all 500ms ease;
  list-style: none;
  margin: 0px;
  overflow: hidden;
  z-index: 3;

  animation: ${PopIn} 100ms linear;
`;

const MenuItem = styled.li`
  display: flex;
  flex-direction: space-between;
  width: 100%;
  padding: 7px 15px;

  &:hover {
    background-color: ${(props) => props.theme.color.grey[300]};
    cursor: pointer;
  }

  &:focus-visible,
  &:focus-within {
    background-color: ${(props) => props.theme.color.grey[300]};
    outline-offset: -4px;
  }
`;

const Menu = ({ iconSize, options, onSelect }: MenuProps) => {
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

  // TODO: Change selected and perform selections with keyboard
  const handleKeyPresses = (e: KeyboardEvent) => {
    console.log(e);
  };

  useOnClickOutside(
    popperElement,
    (e) => {
      setVisible(false);
    },
    undefined,
    refElement
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPresses);
    return document.removeEventListener("keydown", handleKeyPresses);
  }, []);

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

      <div
        ref={popperElement}
        style={{ ...styles.popper, zIndex: 3 }}
        {...attributes.popper}
      >
        <MenuContainer visible={visible} role="menu">
          {options.map((opt) => {
            return (
              <MenuItem
                key={opt.label}
                onClick={() => {
                  onSelect(opt.value);
                  setVisible(false);
                }}
                role="button"
                tabIndex={0}
              >
                {opt.label}
              </MenuItem>
            );
          })}
          <div ref={setArrowElement} style={styles.arrow}></div>
        </MenuContainer>
      </div>
    </>
  );
};

export default Menu;
