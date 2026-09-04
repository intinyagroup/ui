import Root from "./slider.svelte";
import { Slider as ArkSlider } from "@ark-ui/svelte/slider";

export {
	Root,
	Root as Slider
};

export const SliderRoot = ArkSlider.Root;
export const SliderRange = ArkSlider.Range;
export const SliderThumb = ArkSlider.Thumb;
