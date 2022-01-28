import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

type LoadingButtonParams = {
  loadFnc: Function;
  label: string;
};

const LoadingButton = function ({ loadFnc, label }: LoadingButtonParams) {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      loadFnc().then(() => {
        setLoading(false);
      });
    }
  }, [isLoading]);

  const handleClick = () => setLoading(true);

  return (
    <Button
      variant="primary"
      disabled={isLoading}
      onClick={!isLoading ? handleClick : null}
    >
      {isLoading ? "Loading…" : label}
    </Button>
  );
};

export default LoadingButton;
