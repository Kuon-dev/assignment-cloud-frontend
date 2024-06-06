/** @jsxImportSource react */
import useEmblaCarousel, { type EmblaOptionsType } from "embla-carousel-react";
import { Image } from "@unpic/react";
import { cn } from "~/integrations/libs/shadcn";

import * as EmblaStyles from "~/modules/property/react/components/search-carousel.css";
import {
  PrevButton,
  NextButton,
} from "~/modules/property/react/components/search-carousel-buttons";
import { assignInlineVars } from "@vanilla-extract/dynamic";
// import imageByIndex from './imageByIndex';

type PropType = {
  slides: string[];
  options?: EmblaOptionsType;
};

const PropertyCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const extendedSlides = [...slides, ...slides];

  return (
    <div
      className={cn(EmblaStyles.embla, "embla")}
      ref={emblaRef}
      style={assignInlineVars(EmblaStyles.themeVars, {
        slideSpacing: "0", // 0
        slideSize: "100%", // 100%
        slideHeight: "15rem", // 15rem
      })}
    >
      <div className={cn("embla__viewport", "overflow-hidden")}>
        <div className={cn("embla__container", "ml-[calc(1rem * -1)]")}>
          {extendedSlides.map((img, index) => (
            <div
              className={cn(
                "embla__slide",
                "min-w-0 relative pl-[1rem] flex-[0_0_33.333%]"
              )}
              key={index}
            >
              <Image
                background="auto"
                layout="constrained"
                className={cn(
                  EmblaStyles.emblaParallaxImg,
                  "",
                  "block w-full object-cover",
                  "opacity-[0.9] max-w-none",
                  "h-[15rem]"
                )}
                src={img}
                aspectRatio={16 / 9}
                height={100}
              />
            </div>
          ))}
        </div>

        <div
          className={cn(
            EmblaStyles.emblaButtons,
            "embla__buttons",
            "flex items-center absolute top-2/4 -translate-y-1/2 left-[0rem] w-full justify-between"
          )}
        >
          <PrevButton onClick={() => emblaApi && emblaApi.scrollPrev()} />
          <NextButton onClick={() => emblaApi && emblaApi.scrollNext()} />
        </div>
      </div>
    </div>
  );
};

export default PropertyCarousel;
