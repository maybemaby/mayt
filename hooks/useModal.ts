import { useContext } from "react";
import { ModalContext } from "../components/ModalProvider";

export const useModal = () => {
  const modalState = useContext(ModalContext);

  const open = () => {
    if (modalState.setOpen !== null) {
      modalState.setOpen(true);
    }
  };

  const close = () => {
    if (modalState.setOpen !== null) {
      modalState.setOpen(false);
    }
  };

  return { openState: modalState.open, open, close };
};
