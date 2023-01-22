import { AbortTaskFunction } from './AbortTaskFunction';
import { ArgumentArray, PromiseType} from './types';

export interface TaskExecutor {
    signal: AbortSignal;
    /**
     * @description Add task to the queue and execute that at the right time
     * @param callback {(signal: AbortSignal, ...args) => Promise}
     * @param args
     * @param context
     */
    exec<C, A extends ArgumentArray, R>(callback: AbortTaskFunction<C, A, R>, args?: A, context?: C): PromiseType<R>;
    /**
     * @description Clear tasks that have not been started
     */
    clear(): void;
}
