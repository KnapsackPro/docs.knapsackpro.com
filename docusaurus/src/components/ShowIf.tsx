import { ReactNode } from "react";
import { useSearchParam } from "@site/src/hooks/useSearchParam";
import useIsBrowser from "@docusaurus/useIsBrowser";

export const ShowIfSearchParam = ({
  searchParam,
  children,
}: {
  searchParam: string;
  children: ReactNode;
}) => {
  const isBrowser = useIsBrowser();
  if (!isBrowser) return <>{children}</>;

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
  const isBrowser = useIsBrowser();
  if (!isBrowser) return <>{children}</>;

  const [values] = useSearchParam(searchParam);

  if (value[0] === "!") {
    if (values.size === 1 && values.has(value.substring(1))) {
      return null;
    }
  } else {
    if (!values.has(value)) {
      return null;
    }
  }
  return <>{children}</>;
};
