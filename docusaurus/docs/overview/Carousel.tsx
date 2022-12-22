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

type Image = {
  src: string;
  alt: string;
};

export const Carousel = ({ images }: { images: Image[] }) => {
  return (
    <CarouselProvider
      naturalSlideWidth={16}
      naturalSlideHeight={9}
      totalSlides={images.length}
    >
      <Slider>
        {images.map(({ src, alt }, i) => {
          return (
            <Slide index={i}>
              <Image
                hasMasterSpinner={true}
                src={src}
                alt={alt}
                style={{ objectFit: "contain" }}
              />
            </Slide>
          );
        })}
      </Slider>

      <ButtonBack>Back</ButtonBack>
      <ButtonNext>Next</ButtonNext>
    </CarouselProvider>
  );
};
