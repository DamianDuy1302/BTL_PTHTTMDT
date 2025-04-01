"use client";

import { PRODUCT_CATEGORIES } from "@/config";
import { useEffect, useRef, useState } from "react";
import NavItem from "./NavItem";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

const NavItems = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
      }
    };
    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);

  useOnClickOutside(navRef, () => setActiveIndex(null));

  return (
    <>
      <div ref={navRef} className="flex gap-4 h-full">
        {PRODUCT_CATEGORIES.map((item, index) => {
          const handleOpen = () => {
            if (activeIndex === index) {
              setActiveIndex(null);
            } else {
              setActiveIndex(index);
            }
          };
          const isOpen = index === activeIndex;
          const isAnyOpen = activeIndex !== null;
          return (
            <NavItem
              category={item}
              handleOpen={handleOpen}
              isOpen={isOpen}
              key={`nav-item-${index}`}
              isAnyOpen={isAnyOpen}
            ></NavItem>
          );
        })}
      </div>
    </>
  );
};

export default NavItems;
