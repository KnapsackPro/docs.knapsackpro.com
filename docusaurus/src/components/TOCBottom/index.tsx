import React, { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

import styles from "./styles.module.css";
import "./styles.module.css";

export const TOCBottom = ({
  heading,
  Icon,
  children,
}: PropsWithChildren<{
  heading: string;
  Icon?: React.ReactNode;
}>): JSX.Element => {
  return (
    <After id=".table-of-contents">
      <ul className="table-of-contents table-of-contents__left-border">
        <li>
          <div className={styles.heading}>
            {heading} {Icon}
          </div>
          <div>{children}</div>
        </li>
      </ul>
    </After>
  );
};

const After = ({
  id,
  children,
}: PropsWithChildren<{ id: string }>): React.ReactPortal | null => {
  const [wrapperElement, setWrapperElement] =
    React.useState<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const element = document.querySelector(id);

    if (!element) {
      return;
    }

    const div = document.createElement("div");
    element.parentElement?.appendChild(div);
    setWrapperElement(div);
    return () => {
      div.parentElement?.removeChild(div);
    };
  }, []);

  if (!wrapperElement) {
    return null;
  }

  return createPortal(children, wrapperElement);
};
