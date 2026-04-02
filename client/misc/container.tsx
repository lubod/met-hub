/* eslint-disable react/require-default-props */
import React from "react";

type Props = {
  children?: any;
  className?: string;
};

export function Container({ children, className = "" }: Props) {
  return (
    <div className={`glass rounded-xl p-4 w-full ${className}`}>
      {children}
    </div>
  );
}

export function HeaderContainer({ children }: Props) {
  return (
    <div className="glass-header rounded-xl px-4 py-3">
      {children}
    </div>
  );
}
