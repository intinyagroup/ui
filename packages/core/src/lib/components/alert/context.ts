import { getContext } from "svelte";

export type AlertContext = {
	titleId: string;
	descriptionId: string;
};

export function getAlert(): AlertContext {
	const context = getContext<AlertContext>("alert");
	if (!context) {
		throw new Error("Alert components must be used within an <Alert.Root>");
	}
	return context;
}
