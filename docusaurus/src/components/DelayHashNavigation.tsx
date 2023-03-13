import React, { useEffect } from "react";

export const DelayHashNavigation = ({
  milliseconds,
}: {
  milliseconds: number;
}) => {
  useEffect(() => {
    const hash = location.hash;
    const element = document.querySelector(hash);
    if (!element) return;
    const callback = () => {
      element.scrollIntoView({ behavior: "smooth" });
    };
    const timeout = setTimeout(callback, milliseconds);
    () => clearTimeout(timeout);
  }, []);

  return null;
};
