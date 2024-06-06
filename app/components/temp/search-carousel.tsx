/** @jsxImportSource react */
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel, {
  type EmblaOptionsType,
  type EmblaCarouselType,
} from "embla-carousel-react";
import { flushSync } from "react-dom";
import { Image } from "@unpic/react";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cn } from "~/integrations/libs/shadcn";

import * as EmblaStyles from "~/modules/property/react/components/search-carousel.css";
import { DotButton, PrevButton, NextButton } from "./search-carousel-buttons";
// import imageByIndex from './imageByIndex';

const TWEEN_FACTOR = 1.2;

type PropType = {
  slides: string[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [tweenValues, setTweenValues] = useState<number[]>([]);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;

    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();

    const styles = emblaApi.scrollSnapList().map((scrollSnap, index) => {
      let diffToTarget = scrollSnap - scrollProgress;

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();
          if (index === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
          }
        });
      }
      return diffToTarget * (-1 / TWEEN_FACTOR) * 100;
    });
    setTweenValues(styles);
  }, [emblaApi, setTweenValues]);

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    onScroll();
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("reInit", onScroll);
    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", () => {
      flushSync(() => onScroll());
    });
  }, [emblaApi, onInit, onSelect, onScroll]);

  return (
    <>
      <div
        className={cn(EmblaStyles.embla)}
        style={assignInlineVars(EmblaStyles.themeVars, {
          slideSpacing: "0", // 0
          slideSize: "100%", // 100%
          slideHeight: "15rem", // 15rem
        })}
      >
        <div
          className={cn("embla__viewport", "overflow-hidden")}
          ref={emblaRef}
        >
          <div
            className={cn(
              EmblaStyles.emblaContainer,
              "embla__container",
              "ml-0"
            )}
          >
            {slides.map((img, index) => (
              <div
                className={cn(
                  "embla__slide",
                  "min-w-0 relative pl-0 flex-[0_0_100%]"
                )}
                key={index}
              >
                <div
                  className={cn("embla__parallax", "h-full overflow-hidden")}
                >
                  <div
                    className={cn(
                      "embla__parallax__layer",
                      "relative h-full w-full bg-black"
                    )}
                    style={{
                      ...(tweenValues.length && {
                        transform: `translateX(${tweenValues[index]}%)`,
                      }),
                    }}
                  >
                    <Image
                      background="auto"
                      layout="constrained"
                      onError={(e) => {
                        console.log(e);
                      }}
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
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className={cn(
            EmblaStyles.emblaButtons,
            "embla__buttons",
            "flex items-center absolute top-2/4 -translate-y-1/2 left-[0rem] w-full justify-between"
          )}
        >
          <PrevButton
            onClick={() => emblaApi && emblaApi.scrollPrev()}
            disabled={prevBtnDisabled}
          />
          <NextButton
            onClick={() => emblaApi && emblaApi.scrollNext()}
            disabled={nextBtnDisabled}
          />
        </div>
        <div className={cn(EmblaStyles.emblaDots)}>
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => emblaApi && emblaApi.scrollTo(index)}
              className={cn(
                EmblaStyles.emblaDot,
                index === selectedIndex ? EmblaStyles.emblaDotSelected : null
              )}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default EmblaCarousel;
