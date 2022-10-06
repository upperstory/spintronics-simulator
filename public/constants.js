
// Kelly Test for screen size detection
// Let's say 2 pixels = 0.001 m.
export const version = "1.2"
export const worldScale = 2 / 0.001;
export const tileSpacing = 310;
export let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
export let isTouchMobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi|Android/));