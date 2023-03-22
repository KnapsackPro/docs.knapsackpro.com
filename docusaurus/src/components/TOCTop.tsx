import React, { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export const TOCTop = ({
  label,
  children,
}: PropsWithChildren<{ label: string }>) => {
  const [domReady, setDomReady] = React.useState(false);

  React.useEffect(() => {
    setDomReady(true);
  });

  if (!domReady) {
    return null;
  }

  const element = document.querySelector("#tableOfContentsTop");

  if (!element) {
    return null;
  }

  return createPortal(
    <ul className="table-of-contents table-of-contents__left-border">
      <li>
        <span style={{ color: "var(--ifm-toc-link-color)", display: "block" }}>
          {label}
        </span>
        <ul>
          {React.Children.map(children, (child) => {
            return <li>{child}</li>;
          })}
        </ul>
      </li>
    </ul>,
    element
  );
};
