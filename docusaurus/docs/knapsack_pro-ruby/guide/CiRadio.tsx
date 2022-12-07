import React from "react";

export const CiRadio = ({ value }) => {
  const onChange = () => {
    const guideProviders = document.querySelector("#guide-providers");
    if (!(guideProviders instanceof HTMLElement)) {
      return;
    }
    const guideProvider = document.querySelector(`#guide-provider-${value}`);
    if (!(guideProvider instanceof HTMLElement)) {
      return;
    }
    const guideFinalStep = document.querySelector("#guide-final-step");
    if (!(guideFinalStep instanceof HTMLElement)) {
      return;
    }

    Array.from(guideProviders.children).forEach((element: HTMLElement) => {
      element.style.display = "none";
    });
    guideProvider.style.display = "block";
    guideFinalStep.style.display = "block";
  };

  return (
    <input type="radio" name="ci-provider" value={value} onChange={onChange} />
  );
};
