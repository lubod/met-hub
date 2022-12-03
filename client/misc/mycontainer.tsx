/* eslint-disable react/require-default-props */
/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */
import React from "react";
import { Container } from "react-bootstrap";

type Props = {
  children?: any;
};

export function MyContainer({ children }: Props) {
  return (
    <Container className="text-center text-light border-secondary bg-very-dark rounded mb-2 py-2 h-100">
      {children}
    </Container>
  );
}
