import React from "react";
import create from "zustand";

interface ModalState {
  Component: React.FC<any>;
  props: Record<string, unknown>;
}

interface ModalStoreState<T = boolean> {
  active: T extends true ? ModalState : null;
  isShowing: T;
  show: <T extends {}>(component: React.FC<T>, props: T) => void;
  close: () => void;
}

export const useModalStore = create<ModalStoreState>()((set, get) => ({
  active: null,
  isShowing: false,
  show<T extends {}>(component: React.FC<T>, props: T) {
    set(() => {
      return {
        isShowing: true,
        active: {
          Component: component,
          props,
        },
      };
    });
  },
  close() {
    set(() => {
      return {
        active: null,
        isShowing: false,
      };
    });
  },
}));
