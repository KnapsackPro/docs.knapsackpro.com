import React from "react";

export const TestRunnerCheckbox = ({ id }) => {
  const onChange = () => {
    const testRunnerCheckbox = document.querySelector(`#${id}`);
    if (!(testRunnerCheckbox instanceof HTMLInputElement)) {
      return;
    }
    const guideId = document.querySelector(`#guide-${id}`);
    if (!(guideId instanceof HTMLElement)) {
      return;
    }
    guideId.style.display = testRunnerCheckbox.checked ? "block" : "none";
  };

  return <input type="checkbox" id={id} onChange={onChange} />;
};
