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
      naturalSlideWidth={1590}
      naturalSlideHeight={875}
      totalSlides={images.length}
    >
      <Slider>
        {images.map(({ src, alt }, i) => {
          return (
            <Slide index={i}>
              <a href={src} target="_blank" rel="noopener noreferrer">
                <Image
                  hasMasterSpinner={true}
                  src={src}
                  alt={alt}
                  style={{ objectFit: "contain" }}
                />
              </a>
            </Slide>
          );
        })}
      </Slider>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <ButtonBack className="button--primary">Back</ButtonBack>
        <ButtonNext className="button--primary">Next</ButtonNext>
      </div>
    </CarouselProvider>
  );
};
