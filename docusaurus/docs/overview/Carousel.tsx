import React from "react";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  Image,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

export const Carousel = ({ srcs }: { srcs: string[] }) => {
  return (
    <CarouselProvider
      naturalSlideWidth={16}
      naturalSlideHeight={9}
      totalSlides={srcs.length}
    >
      <Slider>
        {srcs.map((src, i) => {
          return (
            <Slide index={i}>
              <Image src={src} style={{ objectFit: "contain" }} />
            </Slide>
          );
        })}
      </Slider>

      <ButtonBack>Back</ButtonBack>
      <ButtonNext>Next</ButtonNext>
    </CarouselProvider>
  );
};
