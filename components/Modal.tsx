import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";
import { AiOutlineClose } from "react-icons/ai";
import { useModal } from "@hooks/useModal";
import useOnClickOutside from "@hooks/useOnClickOutside";
import popIn from "./animations/PopIn";
import { IconButton } from "./common/IconButton";

const Underlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.53);
  z-index: 99;
`;

const Container = styled.div`
  font-family: "Poppins", Fira Sans, -apple-system, BlinkMacSystemFont, Segoe UI,
    Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, sans-serif;
  position: absolute;
  margin: auto;
  min-height: 100px;
  min-width: 300px;
  padding: 20px;
  margin: 0 10px;
  z-index: 100;
  border-radius: 15px;
  display: flex;
  height: fit-content;
  animation: ${popIn} 100ms linear;
  background-color: whitesmoke;
  opacity: 1;

  button.exit {
    position: absolute;
    top: 10px;
    right: 10px;
  }
`;

const Modal = ({ children }: { children: React.ReactNode }) => {
  const { openState, close } = useModal();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(containerRef, () => {
    close();
  });

  useEffect(() => {
    topRef.current = document.querySelector("#__next");

    return () => {
      topRef.current = null;
    };
  }, [topRef]);

  return (
    <>
      {openState &&
        topRef.current &&
        createPortal(
          <Underlay>
            <Container ref={containerRef}>
              <IconButton className="exit" onClick={() => close()}>
                <AiOutlineClose size={25} />
              </IconButton>
              {children}
            </Container>
          </Underlay>,
          topRef.current
        )}
    </>
  );
};

export default Modal;
