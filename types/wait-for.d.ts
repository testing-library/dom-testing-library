export interface waitForOptions {
    container?: HTMLElement;
    timeout?: number;
    interval?: number;
    mutationObserverOptions?: MutationObserverInit;
}

export function waitFor<T>(
    callback: () => T,
    options?: waitForOptions,
): Promise<T>;
