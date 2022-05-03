// Temp fix for OffscreenCanvaswas removed from lib.dom.d.ts in Typescript 4.4
// https://github.com/twilio/twilio-video.js/issues/1629
// https://github.com/microsoft/TypeScript/issues/45745#issuecomment-916440817
declare type OffscreenCanvas = any;