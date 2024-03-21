/* eslint-disable react/require-default-props */
import React from "react";

type Props = {
  children?: any;
};

export function Container({ children }: Props) {
  return (
    <div className="container bg-black bg-opacity-50 rounded-md p-4">
      {children}
    </div>
  );
}

export function MyModalContainer({ children }: Props) {
  return (
    <div className="container text-center text-light border-secondary bg-dark rounded mb-2 py-2 h-90">
      {children}
    </div>
  );
}
