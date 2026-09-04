import Root from "./slider.svelte";
import { Slider as SliderPrimitive } from "bits-ui";

export {
	Root,
	Root as Slider
};

export const SliderRoot = SliderPrimitive.Root;
export const SliderRange = SliderPrimitive.Range;
export const SliderThumb = SliderPrimitive.Thumb;
