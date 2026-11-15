/* eslint-disable import/prefer-default-export */
import React from "react";

type LoadImgProps = {
  rotate: boolean;
  src: string;
  alt?: string;
  className?: string;
};

export function LoadImg({
  rotate,
  src,
  alt = "",
  className = "",
}: LoadImgProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${rotate ? "animate-spin" : ""} ${className}`.trim()}
    />
  );
}
