import { TaskExecutor } from './TaskExecutor';
import { Disposable } from './Disposable';
import { AbortTaskFunction } from './AbortTaskFunction';
import { ArgumentArray, PromiseType } from './types';
import { AbortDefer } from './AbortDefer';
import { isPromise } from './isPromise';

export class Execution<C, A extends ArgumentArray, R, F extends AbortTaskFunction<C, A, R>> {
    readonly #defer: AbortDefer<R>;
    readonly #fn: F;
    readonly #args: A;
    readonly #context: C | undefined;
    readonly #abortController = new AbortController();
    constructor(signal: AbortSignal, fn: F, args: A, context?: C) {
        this.#defer = new AbortDefer<R>(signal);
        this.#fn = fn;
        this.#args = args;
        this.#context = context;
        signal.addEventListener(
            'abort',
            () => {
                this.#abortController.abort();
            },
            {
                signal: this.#abortController.signal
            }
        );
    }
    get promise() {
        return this.#defer.promise;
    }
    execute<P>(previous?: PromiseType<P>): PromiseType<R> {
        const ret = this.#fn.call(this.#context as C, {
            args: this.#args,
            previous,
            signal: this.#abortController.signal
        });
        if (isPromise(ret)) {
            return ret;
        } else {
            return Promise.resolve(ret) as PromiseType<R>;
        }
    }
    cancel() {
        this.#abortController.abort();
    }
    isCancelled() {
        return this.#abortController.signal.aborted;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyExecution = Execution<any, any, any, any>;

export class QueuedTaskExecutor implements TaskExecutor {
    readonly #disposable = new Disposable();
    readonly #executions: Array<AnyExecution> = [];
    #executing?: AnyExecution;
    #isRunning: boolean = false;
    public readonly signal: AbortSignal;
    constructor(signal?: AbortSignal) {
        if (signal) {
            this.signal = signal;
        } else {
            const controller = new AbortController();
            this.signal = controller.signal;
            this.#disposable.addDisposable(() => {
                controller.abort();
            });
        }
    }
    private async notify() {
        if (this.#isRunning) {
            return;
        }
        this.#isRunning = true;

        while (!this.signal.aborted) {
            const execution = this.#executions.shift();
            if (!execution) {
                this.#isRunning = false;
                return;
            }
            if (execution.isCancelled()) {
                continue;
            }
            const previousPromise = this.#executing?.promise;
            this.#executing = execution;
            try {
                if (previousPromise) {
                    await previousPromise;
                }
            } finally {
                execution.execute(previousPromise);
            }
        }
    }
    exec<C, A extends ArgumentArray, R>(
        fn: AbortTaskFunction<C, A, R>,
        args: A = [] as unknown as A,
        context?: C
    ): PromiseType<R> {
        const execution = new Execution(this.signal, fn, args, context);
        this.#executions.push(execution);
        // noinspection JSIgnoredPromiseFromCall
        this.notify();
        return execution.promise as PromiseType<R>;
    }
    clear(): void {
        this.#disposable.dispose();
    }
}
