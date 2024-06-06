/* 
 * DIFFERENT FILE 
 * search-carousel.css.ts
 * */

import { createThemeContract, style } from "@vanilla-extract/css";

type EmblaVars = {
  slideSpacing: string | null;
  slideSize: string | null;
  slideHeight: string | null;
};

export const themeVars = createThemeContract({
  // slideSpacing: '0rem',
  slideSpacing: null, // 0
  slideSize: null, // 100%
  slideHeight: null, // 15rem
});

export const emblaVars: EmblaVars = {
  slideSpacing: themeVars.slideSpacing ?? "0",
  slideSize: themeVars.slideSize ?? "100%",
  slideHeight: themeVars.slideHeight ?? "15rem",
};

export const embla = style({
  position: "relative",
});
export const emblaViewport = style({
  overflow: "hidden",
});

export const emblaContainer = style({
  backfaceVisibility: "hidden",
  display: "flex",
  touchAction: "pan-y",
});

export const emblaSlideNumber = style({
  width: "4.6rem",
  height: "4.6rem",
  zIndex: 1,
  position: "absolute",
  top: "0.6rem",
  right: "0.6rem",
  borderRadius: "50%",
  backgroundColor: "rgba(var(--background-site-rgb-value), 0.85)",
  lineHeight: "4.6rem",
  fontWeight: 900,
  textAlign: "center",
  pointerEvents: "none",
});

export const emblaSlideNumberSpan = style({
  color: "var(--brand-primary)",
  backgroundImage:
    "linear-gradient(45deg, var(--brand-primary), var(--brand-secondary))",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontSize: "1.6rem",
  display: "block",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

export const emblaParallaxImg = style({
  width: `calc(100% + (var(${themeVars.slideSpacing}) * 2))`,
  marginLeft: `calc(var(${themeVars.slideSpacing}) * -1)`,
});

export const emblaButton = style({
  WebkitAppearance: "none",
  backgroundColor: "transparent",
  touchAction: "manipulation",
  display: "inline-flex",
  textDecoration: "none",
  cursor: "pointer",
  border: 0,
  padding: 0,
  margin: 0,
  zIndex: 1,
  color: "var(--background-site)",
  alignItems: "center",
  justifyContent: "center",
  width: "4rem",
  height: "4rem",
  ":disabled": {
    opacity: 0.3,
  },
});

export const emblaButtons = style({
  display: "flex",
  alignItems: "center",
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  left: "0rem",
  width: "100%",
  justifyContent: "space-between",
  selectors: {
    [`:global(.${embla}:hover) &`]: {
      display: "flex",
      transition: "all",
    },
  },
});

// export const emblaHoverButton = style({
//   ':hover': {
//     display: 'flex',
//     transition: 'all',
//   },
// });

export const emblaButtonSvg = style({
  width: "65%",
  height: "65%",
});

export const emblaDotAfter = {
  background: "#fff",
  opacity: 0.7,
  borderRadius: "0.2rem",
  width: "100%",
  height: "0.3rem",
  content: '""',
};

export const emblaDot = style({
  WebkitAppearance: "none",
  backgroundColor: "transparent",
  touchAction: "manipulation",
  display: "inline-flex",
  textDecoration: "none",
  cursor: "pointer",
  border: 0,
  padding: 0,
  margin: 0,
  width: "0.6rem",
  height: "2.4rem",
  // display: 'flex',
  alignItems: "center",
  marginRight: "0.75rem",
  marginLeft: "0.75rem",
  justifyContent: "center",
  ":after": emblaDotAfter,
});

export const emblaDots = style({
  zIndex: 1,
  bottom: "0.3rem",
  position: "absolute",
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const emblaDotSelected = style({
  width: "1rem",
  transition: "ease-in-out",
  ":after": {
    background: "#fff",
    opacity: 1,
  },
});


/* 
 * DIFFERENT FILE 
 * property-carousel.css.ts
 * */

import { createThemeContract, style } from "@vanilla-extract/css";

type EmblaVars = {
  slideSpacing: string | null;
  slideSize: string | null;
  slideHeight: string | null;
};

export const themeVars = createThemeContract({
  // slideSpacing: '0rem',
  slideSpacing: null, // 0
  slideSize: null, // 100%
  slideHeight: null, // 15rem
});

export const emblaVars: EmblaVars = {
  slideSpacing: themeVars.slideSpacing ?? "0",
  slideSize: themeVars.slideSize ?? "100%",
  slideHeight: themeVars.slideHeight ?? "15rem",
};

export const embla = style({
  position: "relative",
});
export const emblaViewport = style({
  overflow: "hidden",
});

export const emblaContainer = style({
  backfaceVisibility: "hidden",
  display: "flex",
  touchAction: "pan-y",
});

export const emblaSlideNumber = style({
  width: "4.6rem",
  height: "4.6rem",
  zIndex: 1,
  position: "absolute",
  top: "0.6rem",
  right: "0.6rem",
  borderRadius: "50%",
  backgroundColor: "rgba(var(--background-site-rgb-value), 0.85)",
  lineHeight: "4.6rem",
  fontWeight: 900,
  textAlign: "center",
  pointerEvents: "none",
});

export const emblaSlideNumberSpan = style({
  color: "var(--brand-primary)",
  backgroundImage:
    "linear-gradient(45deg, var(--brand-primary), var(--brand-secondary))",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontSize: "1.6rem",
  display: "block",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

export const emblaParallaxImg = style({
  width: `calc(100% + (var(${themeVars.slideSpacing}) * 2))`,
  marginLeft: `calc(var(${themeVars.slideSpacing}) * -1)`,
});

export const emblaButton = style({
  WebkitAppearance: "none",
  backgroundColor: "transparent",
  touchAction: "manipulation",
  display: "inline-flex",
  textDecoration: "none",
  cursor: "pointer",
  border: 0,
  padding: 0,
  margin: 0,
  zIndex: 1,
  color: "var(--background-site)",
  alignItems: "center",
  justifyContent: "center",
  width: "4rem",
  height: "4rem",
  ":disabled": {
    opacity: 0.3,
  },
});

export const emblaButtons = style({
  display: "flex",
  alignItems: "center",
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  left: "0rem",
  width: "100%",
  justifyContent: "space-between",
  selectors: {
    [`:global(.${embla}:hover) &`]: {
      display: "flex",
      transition: "all",
    },
  },
});

// export const emblaHoverButton = style({
//   ':hover': {
//     display: 'flex',
//     transition: 'all',
//   },
// });

export const emblaButtonSvg = style({
  width: "65%",
  height: "65%",
});

export const emblaDotAfter = {
  background: "#fff",
  opacity: 0.7,
  borderRadius: "0.2rem",
  width: "100%",
  height: "0.3rem",
  content: '""',
};

export const emblaDot = style({
  WebkitAppearance: "none",
  backgroundColor: "transparent",
  touchAction: "manipulation",
  display: "inline-flex",
  textDecoration: "none",
  cursor: "pointer",
  border: 0,
  padding: 0,
  margin: 0,
  width: "0.6rem",
  height: "2.4rem",
  // display: 'flex',
  alignItems: "center",
  marginRight: "0.75rem",
  marginLeft: "0.75rem",
  justifyContent: "center",
  ":after": emblaDotAfter,
});

export const emblaDots = style({
  zIndex: 1,
  bottom: "0.3rem",
  position: "absolute",
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const emblaDotSelected = style({
  width: "1rem",
  transition: "ease-in-out",
  ":after": {
    background: "#fff",
    opacity: 1,
  },
});
