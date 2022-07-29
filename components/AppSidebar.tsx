import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { BaseSidebar } from "./common/BaseSidebar";
import { IconButton } from "./common/IconButton";
import { BsArrowBarLeft } from "react-icons/bs";

const SidebarList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
  font-size: ${(props) => props.theme.fontSize[3]};
`;

const SidebarItem = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: inherit;

  a {
    text-decoration: none;
    color: inherit;
    font-weight: ${(props) => props.theme.fontWeights.subtitle};
  }
`;

const SidebarBottom = styled.div`
  position: absolute;
  bottom: 40px;
  left: 20px;
  display: flex;
  justify-content: space-between;
  font-size: ${(props) => props.theme.fontSize[3]};

  a {
    font-weight: ${(props) => props.theme.fontWeights.subtitle};
    text-decoration: none;
    color: ${(props) => props.theme.color.grey[700]};
  }
`;

const CloseIcon = styled(BsArrowBarLeft)`
  position: absolute;
  top: 20px;
  right: 20px;

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

export const AppSidebar = ({
  forceShow,
  onClose,
}: {
  forceShow: boolean;
  onClose(e?: React.MouseEvent): void;
}) => {
  return (
    <BaseSidebar
      passStyle={{
        padding: "20px",
      }}
      zIndex={10}
      forceShow={forceShow}
    >
      {forceShow && (
        <IconButton onClick={onClose}>
          <CloseIcon size={25} />
        </IconButton>
      )}
      <h1>Mayt</h1>
      <SidebarList>
        <SidebarItem>
          <Link href="/">
            <a>Home</a>
          </Link>
        </SidebarItem>
        <SidebarItem>
          <Link href="/videos">
            <a>All Videos</a>
          </Link>
        </SidebarItem>
        <SidebarItem>
          <Link href="/playlists">
            <a>Playlists</a>
          </Link>
        </SidebarItem>
        <SidebarItem>
          <Link href="/videos/new">
            <a>Add Videos</a>
          </Link>
        </SidebarItem>
      </SidebarList>
      <SidebarBottom>
        <Link href="/settings">
          <a>Settings</a>
        </Link>
      </SidebarBottom>
    </BaseSidebar>
  );
};
