import React from "react";
import { useSearchParam } from "@site/src/hooks/useSearchParam";

export const CheckboxGroup = ({
  inUrl,
  items,
}: {
  inUrl: string;
  items: {
    value: string;
    label: string;
  }[];
}) => {
  const [checked, setChecked] = useSearchParam(inUrl);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked((prevChecked) => {
      const newChecked = new Set(prevChecked);
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
              type="checkbox"
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
