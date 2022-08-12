import React, { createContext, useState } from "react";

type ModalProviderProps = {
  children: React.ReactNode;
};

type ModalStore = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>> | null;
};

export const ModalContext = createContext<ModalStore>({
  open: false,
  setOpen: null,
});

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [open, setOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
