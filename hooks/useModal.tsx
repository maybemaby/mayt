import React, { useContext, useState } from "react";
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
    if (modalState.setChild) {
      modalState.setChild(<></>);
    }
  };

  const show = (content: React.ReactNode) => {
    if (modalState.setChild) {
      modalState.setChild(content);
    }
    open();
  };

  return {
    openState: modalState.open,
    content: modalState.child,
    open,
    close,
    show,
  };
};
