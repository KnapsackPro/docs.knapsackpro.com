import React, { ReactNode } from "react";
import { useSearchParam } from "@site/src/hooks/useSearchParam";

export const ShowIfSearchParam = ({
  searchParam,
  children,
}: {
  searchParam: string;
  children: ReactNode;
}) => {
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
  const [values] = useSearchParam(searchParam);
  if (!values.has(value)) {
    return null;
  }
  return <>{children}</>;
};
