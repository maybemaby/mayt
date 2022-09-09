import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AiOutlineClose } from "react-icons/ai";
import styled from "styled-components";
import { Portal } from "./Portal";
import PopIn from "@components/animations/PopIn";
import { IconButton } from "./IconButton";

const StyledIconButton = styled(IconButton)`
  position: absolute;
  top: 15px;
  right: 15px;
`;

const ModalContainer = styled.div`
  position: relative;
  padding: 20px;
  background: ${({ theme }) => theme.color.grey[50]};
  width: min(400px, 95%);
  border-radius: 10px;
  animation: ${PopIn} 100ms linear;
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

interface ModalProps {
  onOpen?: () => void;
  onClose?: () => void;
  children?: ReactNode;
}

interface ModalContextProps extends ModalProps {
  open: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalContext = createContext<ModalContextProps>({
  open: false,
});

export const Modal = ({ onOpen, onClose, children }: ModalProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ModalContext.Provider value={{ open, setOpen, onOpen, onClose }}>
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
  const { open, setOpen } = useContext(ModalContext);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      console.log(e.key);
      if (e.key === "Escape" && setOpen) {
        setOpen(false);
      }
    };

    document.body.addEventListener("keydown", handleKeyPress);

    return () => document.body.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <>
      {open && setOpen && (
        <StyledPortal lockBodyScroll={true} target={document.body}>
          <ModalContainer className={className}>
            <StyledIconButton onClick={() => setOpen(false)}>
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
