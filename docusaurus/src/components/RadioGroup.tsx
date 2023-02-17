import React, { useEffect } from "react";
import { useSearchParam } from "@site/src/hooks/useSearchParam";

type Item = {
  value: string;
  label: string;
  defaultChecked?: boolean;
};

export const RadioGroup = ({
  inUrl,
  items,
}: {
  inUrl: string;
  items: Item[];
}) => {
  const [checked, setChecked] = useSearchParam(inUrl);

  useEffect(() => {
    if (checked.size > 0) {
      return;
    }
    const defaultChecked = items.find((item) => item.defaultChecked);
    if (!defaultChecked) {
      return;
    }
    setChecked(() => new Set([defaultChecked.value]));
  }, []);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(() => {
      const newChecked = new Set<string>();
      const item = event.target.value;
      if (event.target.checked) {
        newChecked.add(item);
      } else {
        newChecked.delete(item);
      }
      return newChecked;
    });
  };

  return (
    <ul className="none-list">
      {items.map((item) => (
        <li key={item.value}>
          <label>
            <input
              type="radio"
              name={inUrl}
              value={item.value}
              checked={checked.has(item.value)}
              onChange={onChange}
            />{" "}
            {item.label}
          </label>
        </li>
      ))}
    </ul>
  );
};
