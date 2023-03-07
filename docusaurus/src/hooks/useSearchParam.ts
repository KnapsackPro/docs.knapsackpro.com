import { useEffect, useState, Dispatch } from "react";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

const EVENT_TYPE = "url-search-params-changed";

const getAll = (param: string): Set<string> => {
  const safeLocation = ExecutionEnvironment.canUseDOM ? location.search : "";
  const search = new URLSearchParams(safeLocation);
  return new Set(search.getAll(param));
};

const newSearch = (param: string, values: Set<string>): string => {
  const search = new URLSearchParams(location.search);
  search.delete(param);
  values.forEach((value) => search.append(param, value));
  return search.toString();
};

export const useSearchParam = (
  param: string
): [Set<string>, Dispatch<(_: Set<string>) => Set<string>>] => {
  const [values, setValues] = useState<Set<string>>(getAll(param));


  useEffect(() => {
    const callback = () => {
      setValues(getAll(param));
    };
    window.addEventListener(EVENT_TYPE, callback);
    callback();
    () => window.removeEventListener(EVENT_TYPE, callback);
  }, [param]);

  const updateSearchParam = (
    updateSearchParam_: (_: Set<string>) => Set<string>
  ): void => {
    const newValues = updateSearchParam_(values);
    history.pushState(null, "", `?${newSearch(param, newValues)}`);
    dispatchEvent(new CustomEvent(EVENT_TYPE));
  };

  return [values, updateSearchParam];
};
