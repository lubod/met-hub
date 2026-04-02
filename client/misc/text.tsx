/* eslint-disable react/require-default-props */
import React from "react";

type Props = {
  children?: any;
};

function Text({ children }: Props) {
  return <div className="section-title">{children}</div>;
}

export default Text;
