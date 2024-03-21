/* eslint-disable react/require-default-props */
import React from "react";

type Props = {
  children?: any;
};

export function Container({ children }: Props) {
  return (
    <div className="container bg-black bg-opacity-50 rounded-md p-4 max-w-sm">
      {children}
    </div>
  );
}

export function HeaderContainer({ children }: Props) {
  return (
    <div className="container bg-black bg-opacity-50 rounded-md p-4">
      {children}
    </div>
  );
}
