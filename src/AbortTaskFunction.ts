import { ArgumentArray, PromiseType } from './types';

export type AbortTaskFunction<C, A extends ArgumentArray, R> = (
    this: C,
    options: AbortTaskOptions<A>
) => R | PromiseType<R>;

export interface AbortTaskOptions<A extends ArgumentArray> {
    signal: AbortSignal;
    previous?: Promise<unknown>;
    args: A;
}
