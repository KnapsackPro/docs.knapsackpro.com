import React from "react";
import Tree from "@theme-original/TOCItems/Tree";

export default function TreeWrapper(props) {
  return (
    <>
      <div id="tableOfContentsTop"></div>

      <Tree {...props} />
    </>
  );
}
