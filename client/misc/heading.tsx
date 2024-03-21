/* eslint-disable react/require-default-props */
import React from "react";

type Props = {
  children?: any;
};

function Heading({ children }: Props) {
  return (
    <div className="text-4xl text-blue font-normal font-sans text-center">
      {children}
    </div>
  );
}

export default Heading;
