/* eslint-disable react/require-default-props */
import React from "react";

type Props = {
  children?: any;
};

function Text({ children }: Props) {
  return (
    <div className="text-md text-light font-normal font-sans text-center">
      {children}
    </div>
  );
}

export default Text;
