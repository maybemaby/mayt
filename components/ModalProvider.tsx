import React, { createContext, useState } from "react";

type ModalProviderProps = {
  children: React.ReactNode;
};

type ModalStore = {
  open: boolean;
  child: React.ReactNode;
  setOpen: React.Dispatch<React.SetStateAction<boolean>> | null;
  setChild: React.Dispatch<React.SetStateAction<React.ReactNode>> | null;
};

export const ModalContext = createContext<ModalStore>({
  open: false,
  child: <></>,
  setOpen: null,
  setChild: null,
});

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [open, setOpen] = useState(false);
  const [child, setChild] = useState<React.ReactNode>(() => <></>);

  return (
    <ModalContext.Provider value={{ open, child, setOpen, setChild }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
