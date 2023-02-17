import React, { ReactNode } from "react";
import { useSearchParam } from "@site/src/hooks/useSearchParam";
import BrowserOnly from "@docusaurus/BrowserOnly";

const ShowIfSearchParam_ = ({
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

export const ShowIfSearchParam = (props: {
  searchParam: string;
  children: ReactNode;
}) => <BrowserOnly>{() => <ShowIfSearchParam_ {...props} />}</BrowserOnly>;

const ShowIfSearchParamAndValue_ = ({
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

export const ShowIfSearchParamAndValue = (props: {
  searchParam: string;
  value: string;
  children: ReactNode;
}) => (
  <BrowserOnly>{() => <ShowIfSearchParamAndValue_ {...props} />}</BrowserOnly>
);
