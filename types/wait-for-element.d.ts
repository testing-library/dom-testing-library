import { waitForOptions } from "./wait-for";

export function waitForElement<T>(callback: () => T, options?: waitForOptions): Promise<T>;
