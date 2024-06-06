/** @jsxImportSource react */
import type { SVGProps } from "react";
import React, { type PropsWithChildren } from "react";
import { cn } from "~/integrations/libs/shadcn";
import { emblaButton } from "~/modules/property/react/components/search-carousel.css";

type PropType = PropsWithChildren<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>;

export const DotButton: React.FC<PropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button type="button" {...restProps}>
      {children}
    </button>
  );
};

export const PrevButton: React.FC<PropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button
      className={cn("embla__button embla__button--prev", emblaButton)}
      type="button"
      {...restProps}
    >
      <PrevArrow />
      {children}
    </button>
  );
};

export const NextButton: React.FC<PropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button
      className={cn("embla__button embla__button--next", emblaButton)}
      type="button"
      {...restProps}
    >
      <NextArrow className="text-black" />
      {children}
    </button>
  );
};

function PrevArrow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="2em"
      height="2em"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="12" r="9" fill="black" /> {/* New circle element */}
      <path
        fill="#fff"
        d="M11.8 13H15q.425 0 .713-.288T16 12q0-.425-.288-.713T15 11h-3.2l.9-.9q.275-.275 .275-.7t-.275-.7q-.275-.275-.7-.275t-.7.275l-2.6 2.6q-.3 .3-.3 .7t.3 .7l2.6 2.6q.275 .275 .7 .275t.7-.275q.275-.275 .275-.7t-.275-.7l-.9-.9Zm.2 9q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075 .788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9 .788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"
      ></path>
    </svg>
  );
}

function NextArrow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="2em"
      height="2em"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="12" r="9" fill="black" /> {/* New circle element */}
      <path
        fill="#fff"
        d="m12 16l4-4l-4-4l-1.4 1.4l1.6 1.6H8v2h4.2l-1.6 1.6L12 16Zm0 6q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"
      ></path>
    </svg>
  );
}
