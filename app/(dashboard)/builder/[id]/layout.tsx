import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="mx-auto flex w-full flex-grow">{children}</div>;
};

export default layout;
