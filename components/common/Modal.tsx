import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AiOutlineClose } from "react-icons/ai";
import styled from "styled-components";
import { Portal } from "./Portal";
import PopIn from "@components/animations/PopIn";
import { IconButton } from "./IconButton";
import useOnClickOutside from "@hooks/useOnClickOutside";

const StyledIconButton = styled(IconButton)`
  position: absolute;
  top: 15px;
  right: 15px;

  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.color.primary[300]};
  }
`;

const ModalContainer = styled.div`
  position: relative;
  padding: 20px;
  background: ${({ theme }) => theme.color.grey[50]};
  width: min(400px, 95%);
  border-radius: 10px;
  animation: ${PopIn} 100ms linear;

  @media screen and (min-width: 768px) {
    padding: 40px;
    width: fit-content;
  }
`;

const StyledPortal = styled(Portal)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #232222b2;
  z-index: 990;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface ModalBase {
  onOpen?: () => void;
  onClose?: () => void;
  children?: ReactNode;
}

export interface ModalContextProps extends ModalBase {
  open: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ModalProps extends ModalBase {
  open?: boolean;
}

const ModalContext = createContext<ModalContextProps>({
  open: false,
});

export const Modal = ({ open, onOpen, onClose, children }: ModalProps) => {
  const [_open, setOpen] = useState(false);

  if (typeof open !== "undefined") {
    return (
      <>
        <ModalContext.Provider value={{ open, setOpen, onOpen, onClose }}>
          {children}
        </ModalContext.Provider>
      </>
    );
  }

  return (
    <>
      <ModalContext.Provider value={{ open: _open, setOpen, onOpen, onClose }}>
        {children}
      </ModalContext.Provider>
    </>
  );
};

interface ButtonProps {
  className?: string;
  children?: ReactNode;
}

const Button = ({ className, children }: ButtonProps) => {
  const { setOpen, onOpen } = useContext(ModalContext);

  const handleClick = () => {
    if (setOpen) setOpen(true);
    if (onOpen) onOpen();
  };

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
};

interface BodyProps {
  className?: string;
  children?: ReactNode;
}

const Body = ({ className, children }: BodyProps) => {
  const { open, setOpen, onClose } = useContext(ModalContext);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" && setOpen) {
        setOpen(false);
        if (onClose) onClose();
      }
    };

    document.body.addEventListener("keydown", handleKeyPress);

    return () => document.body.removeEventListener("keydown", handleKeyPress);
  }, [setOpen]);

  const handleClick = () => {
    if (setOpen) setOpen(false);
    if (onClose) onClose();
  };

  useOnClickOutside(ref, () => handleClick());

  return (
    <>
      {open && setOpen && (
        <StyledPortal lockBodyScroll={true} target={document.body}>
          <ModalContainer ref={ref} className={className}>
            <StyledIconButton id="close-modal" onClick={handleClick}>
              <AiOutlineClose size={25} />
            </StyledIconButton>
            {children}
          </ModalContainer>
        </StyledPortal>
      )}
    </>
  );
};

Modal.Button = Button;
Modal.Body = Body;
