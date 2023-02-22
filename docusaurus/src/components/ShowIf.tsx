import React, { ReactNode } from "react";
import { useSearchParam } from "@site/src/hooks/useSearchParam";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

export const ShowIfSearchParam = ({
  searchParam,
  children,
}: {
  searchParam: string;
  children: ReactNode;
}) => {
  if (!ExecutionEnvironment.canUseDOM) {
    return <>{children}</>;
  }
  const [values] = useSearchParam(searchParam);
  if (values.size === 0) {
    return null;
  }
  return <>{children}</>;
};

export const ShowIfSearchParamAndValue = ({
  searchParam,
  value,
  children,
}: {
  searchParam: string;
  value: string;
  children: ReactNode;
}) => {
  if (!ExecutionEnvironment.canUseDOM) {
    return <>{children}</>;
  }
  const [values] = useSearchParam(searchParam);
  if (!values.has(value)) {
    return null;
  }
  return <>{children}</>;
};
