import React from "react";
import styled from "styled-components";
import { AppSidebar } from "../AppSidebar";

type WithSidebarProps = {
  children: React.ReactNode;
};

const Main = styled.main`
  margin-left: 200px;
`;

export const WithSidebar = ({ children }: WithSidebarProps) => {
  return (
    <>
      <AppSidebar />
      <Main>{children}</Main>
    </>
  );
};
