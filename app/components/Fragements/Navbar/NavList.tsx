"use client";
import React from "react";
import NavItem from "./NavItem";

interface Props {
  items: { name: string; path: string }[];
  onItemClick?: () => void;
  className?: string;
  isMobile?: boolean;
}

const NavList = ({ items, onItemClick, className, isMobile }: Props) => {
  return (
    // navbar list dengan items
    <ul className={className}>
      {items.map((item) => (
        <NavItem
          key={item.path}
          name={item.name}
          path={item.path}
          onClick={onItemClick}
          isMobile={isMobile}
          classname="group"
        />
      ))}
    </ul>
  );
};

export default NavList;
