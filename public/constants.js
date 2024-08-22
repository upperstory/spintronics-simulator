
// Kelly Test for screen size detection
// Let's say 2 pixels = 0.001 m.
export const version = "1.2"
export const worldScale = 2 / 0.001;
export const tileSpacing = 310;
export let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
// console.log("on touch start: ", 'ontouchstart' in document.documentElement);
// console.log("user agent: ", navigator.userAgent.match(/Mobi|Android|iPad/));

let touchScreenMatch = '';
touchScreenMatch = (navigator.userAgent.match(/Mobi|Android|iPad/));
// console.log("touchscreenmatch: ", touchScreenMatch);

if ( touchScreenMatch ) {
    touchScreenMatch = true;
    // console.log("IS TOUCH SCREEN USER AGENT.");
}
// console.log("True && null", false && null);
export let isTouchMobile = ('ontouchstart' in document.documentElement && ( touchScreenMatch || touchScreenMatch === null) );
// console.log("isTouchMobile: ", isTouchMobile);