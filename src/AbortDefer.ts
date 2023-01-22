export class AbortDefer<T> {
    #resolve!: (value: T) => void;
    #reject!: (reason?: unknown) => void;
    #promise = new Promise<T>((resolve, reject) => {
        this.#resolve = resolve;
        this.#reject = reject;
    });
    constructor(private readonly signal: AbortSignal) {}
    get promise() {
        return this.#promise;
    }
    resolve(value: T) {
        if (this.signal.aborted) {
            this.#reject(this.signal.reason || new Error('DOMException defer is aborted without reason'));
        } else {
            this.#resolve(value);
        }
    }
    reject(reason?: unknown) {
        this.#reject(reason);
    }
}
