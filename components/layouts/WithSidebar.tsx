import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AppSidebar } from "../AppSidebar";
import { AppHeader } from "../AppHeader";
import { useModal } from "../../hooks/useModal";
import { useRouter } from "next/router";

type WithSidebarProps = {
  children: React.ReactNode;
};

const Main = styled.main`
  margin-left: 0;
  /* margin-top: 100px; */
  transition: all 200ms ease;
  display: flex;
  flex-direction: column;
  min-height: 90vh;
  overflow-x: hidden;
  margin-bottom: 100px;

  @media screen and (min-width: 768px) {
    margin-left: 208px;
    margin-top: 0;
  }
`;

export const WithSidebar = ({ children }: WithSidebarProps) => {
  const { close } = useModal();
  const { route } = useRouter();
  const [showSideBar, setShowSidebar] = useState(false);
  const sidebarCloser = () => {
    setShowSidebar(false);
  };

  useEffect(() => {
    close();
    setShowSidebar(false);
  }, [route, close]);

  return (
    <>
      <AppHeader onMenuClick={() => setShowSidebar(true)} />

      <AppSidebar forceShow={showSideBar} onClose={sidebarCloser} />
      <Main>{children}</Main>
    </>
  );
};
