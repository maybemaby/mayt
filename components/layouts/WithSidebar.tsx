import React, { useState } from "react";
import styled from "styled-components";
import { AppSidebar } from "../AppSidebar";
import { AppHeader } from "../AppHeader";

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

  @media screen and (min-width: 768px) {
    margin-left: 208px;
    margin-top: 0px;
  }
`;

export const WithSidebar = ({ children }: WithSidebarProps) => {
  const [showSideBar, setShowSidebar] = useState(false);
  const sidebarCloser = () => {
    setShowSidebar(false);
  };

  return (
    <>
      <AppHeader onMenuClick={() => setShowSidebar(true)} />

      <AppSidebar forceShow={showSideBar} onClose={sidebarCloser} />
      <Main>{children}</Main>
    </>
  );
};
