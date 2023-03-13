import React, { useEffect } from "react";

export const DelayHashNavigation = ({
  milliseconds,
}: {
  milliseconds: number;
}) => {
  useEffect(() => {
    const hash = location.hash;
    if (hash.length === 0) return;
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
