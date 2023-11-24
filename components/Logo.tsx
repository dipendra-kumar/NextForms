import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link
      href={"/"}
      className="text-3xl font-bold  tracking-wider hover:cursor-pointer"
    >
      Forms
    </Link>
  );
};

export default Logo;
