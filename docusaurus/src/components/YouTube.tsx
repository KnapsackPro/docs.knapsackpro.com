import React from "react";

export const YouTube = ({ src }: { src: string }) => {
  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "56.25%",
        overflow: "hidden",
        maxWidth: "100%",
        height: "auto",
      }}
    >
      <iframe
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
        }}
        width="560"
        height="315"
        src={src}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};
