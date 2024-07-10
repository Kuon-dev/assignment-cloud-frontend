// /** @jsxImportSource react */
// import useEmblaCarousel, { type EmblaOptionsType } from "embla-carousel-react";
// import { Image } from "@unpic/react";
// import { cn } from "@/lib/utils";

// import * as EmblaStyles from "@/components/search/search-carousel.css";
// import {
//   PrevButton,
//   NextButton,
// } from "@/components/search/search-carousel-buttons";
// import { assignInlineVars } from "@vanilla-extract/dynamic";
// // import imageByIndex from './imageByIndex';

// type PropType = {
//   slides: string[];
//   options?: EmblaOptionsType;
// };

// const PropertyCarousel: React.FC<PropType> = (props) => {
//   const { slides, options } = props;
//   const [emblaRef, emblaApi] = useEmblaCarousel(options);
//   const extendedSlides = [...slides, ...slides];

//   return (
//     <div
//       className={cn(EmblaStyles.embla, "embla")}
//       ref={emblaRef}
//       style={assignInlineVars(EmblaStyles.themeVars, {
//         slideSpacing: "0", // 0
//         slideSize: "100%", // 100%
//         slideHeight: "15rem", // 15rem
//       })}
//     >
//       <div className={cn("embla__viewport", "overflow-hidden")}>
//         <div className={cn("embla__container", "ml-[calc(1rem * -1)]")}>
//           {extendedSlides.map((img, index) => (
//             <div
//               className={cn(
//                 "embla__slide",
//                 "min-w-0 relative pl-[1rem] flex-[0_0_33.333%]"
//               )}
//               key={index}
//             >
//               <Image
//                 background="auto"
//                 layout="constrained"
//                 className={cn(
//                   EmblaStyles.emblaParallaxImg,
//                   "",
//                   "block w-full object-cover",
//                   "opacity-[0.9] max-w-none",
//                   "h-[15rem]"
//                 )}
//                 src={img}
//                 aspectRatio={16 / 9}
//                 height={100}
//               />
//             </div>
//           ))}
//         </div>

//         <div
//           className={cn(
//             EmblaStyles.emblaButtons,
//             "embla__buttons",
//             "flex items-center absolute top-2/4 -translate-y-1/2 left-[0rem] w-full justify-between"
//           )}
//         >
//           <PrevButton onClick={() => emblaApi && emblaApi.scrollPrev()} />
//           <NextButton onClick={() => emblaApi && emblaApi.scrollNext()} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyCarousel;
import { HTMLAttributes, useRef } from "react";
import { cn } from "@/lib/utils";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "../ui/card";

interface PropertyCarouselFormProps extends HTMLAttributes<HTMLDivElement> {
  // slides: string[];
}

export default function PropertyCarousel({
  // slides,
  className,
  ...props
}: PropertyCarouselFormProps) {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  const slides = [
    "https://picsum.photos/id/237/200/300",
    "https://picsum.photos/id/240/200/300",
    "https://picsum.photos/id/233/200/300",
    "https://picsum.photos/id/235/200/300",
    "https://picsum.photos/id/238/200/300",
  ];

  return (
    <div className={cn(className)} {...props}>
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <img
                      src={slides[index % slides.length]}
                      alt={slides[index % slides.length]}
                      className="h-64 w-full object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
