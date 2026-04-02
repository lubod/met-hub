/* eslint-disable react/require-default-props */
import React from "react";

type Props = {
  children?: any;
};

function Heading({ children }: Props) {
  return (
    <div className="text-3xl font-light tracking-tight text-white/90 text-center">
      {children}
    </div>
  );
}

export default Heading;
