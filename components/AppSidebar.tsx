import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { BaseSidebar } from "./common/BaseSidebar";
import { BsPlayFill, BsPlusLg, BsFillGearFill } from "react-icons/bs";
import { MdOutlinePlaylistPlay } from "react-icons/md";

const SidebarList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 30px;
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
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 5px;
    transition: transform 300ms linear, 0.6s, background-position 0s;
    background: linear-gradient(
        ${(props) => props.theme.color.secondary[50]} 0 0
      )
      left / var(--p, 0) no-repeat;
  }

  a:hover,
  a:focus {
    --p: 100%;
    background-position: right;
  }

  a:active {
    transform: scale(1.06);
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
    display: flex;
    align-items: center;
    gap: 15px;
    font-weight: ${(props) => props.theme.fontWeights.subtitle};
    text-decoration: none;
    color: ${(props) => props.theme.color.grey[600]};
    transition: color 400ms ease;
  }

  a:hover,
  a:focus {
    color: ${(props) => props.theme.color.grey[700]};
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
      onClose={onClose}
    >
      <h1>Mayt</h1>
      <SidebarList>
        <SidebarItem>
          <Link href="/">
            <a>Home</a>
          </Link>
        </SidebarItem>
        <SidebarItem>
          <Link href="/videos">
            <a>
              <BsPlayFill size={30} /> All Videos
            </a>
          </Link>
        </SidebarItem>
        <SidebarItem>
          <Link href="/playlists">
            <a>
              <MdOutlinePlaylistPlay size={30} style={{ marginLeft: "5px" }} />
              Playlists
            </a>
          </Link>
        </SidebarItem>
        <SidebarItem>
          <Link href="/videos/add">
            <a>
              <BsPlusLg size={20} style={{ marginLeft: "6px" }} />
              Add Videos
            </a>
          </Link>
        </SidebarItem>
      </SidebarList>
      <SidebarBottom>
        <Link href="/player">
          <a>
            <BsFillGearFill size={25} style={{ marginLeft: "6px" }} />
            Player
          </a>
        </Link>
      </SidebarBottom>
    </BaseSidebar>
  );
};
