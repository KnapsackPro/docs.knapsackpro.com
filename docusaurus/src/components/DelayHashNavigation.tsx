import React, { useEffect } from "react";

export const DelayHashNavigation = ({
  milliseconds,
}: {
  milliseconds: number;
}) => {
  useEffect(() => {
    const hash = location.hash;
    const callback = () => {
      location.hash = "";
      location.hash = hash;
    };
    const timeout = setTimeout(callback, milliseconds);
    () => clearTimeout(timeout);
  }, []);

  return null;
};
