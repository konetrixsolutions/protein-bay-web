"use client";
import React from "react";
import { FaRegUser } from "react-icons/fa";
import { PiShoppingCartBold } from "react-icons/pi";

const Navbar = () => {
  const [selectedNavItem, setSelectedNavItem] = React.useState("Home");
  console.log("selctedItem", selectedNavItem);
  return (
    <div className="flex h-16 w-full items-center justify-around bg-white   md:px-8">
      <p>Protein Bay</p>

      <div className="flex gap-8 text-sm font-medium">
        {["Home", "Categories", "About Us", "Customer Support"].map((item) => (
          <div
            key={item}
            onClick={() => setSelectedNavItem(item)}
            className="relative flex cursor-pointer flex-col items-center pb-2"
          >
            <p
              className={`transition-colors duration-200 ${
                selectedNavItem === item
                  ? "text-primary font-semibold"
                  : "text-foreground hover:text-primary-light"
              }`}
            >
              {item}
            </p>

            {selectedNavItem === item && (
              <span className="absolute bottom-0 h-0.5 w-full rounded-full bg-primary" />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-8 items-center">
        <FaRegUser />
        <PiShoppingCartBold />
      </div>
    </div>
  );
};

export default Navbar;
