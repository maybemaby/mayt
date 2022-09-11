import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import styled from "styled-components";
import type { ToasterProps } from "react-hot-toast";
import { AppSidebar } from "../AppSidebar";
import { AppHeader } from "../AppHeader";

const DynamicToaster = dynamic<ToasterProps>(
  () => import("react-hot-toast").then((mod) => mod.Toaster),
  {
    ssr: false,
  }
);

type WithSidebarProps = {
  children: React.ReactNode;
};

const Main = styled.main`
  margin-left: 0;
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
  const { route } = useRouter();
  const [showSideBar, setShowSidebar] = useState(false);
  const sidebarCloser = () => {
    setShowSidebar(false);
  };

  useEffect(() => {
    setShowSidebar(false);
  }, [route]);

  return (
    <>
      <AppHeader onMenuClick={() => setShowSidebar(true)} />
      <DynamicToaster />
      <AppSidebar forceShow={showSideBar} onClose={sidebarCloser} />
      <Main>{children}</Main>
    </>
  );
};
