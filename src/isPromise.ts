export function isPromise<T>(value: any): value is Promise<T> {
    if (!value) {
        return false;
    }
    if (value instanceof Promise) {
        return true;
    }
    if (typeof value.then === 'function') {
        const prototype = value.constructor?.prototype;
        if (!prototype) {
            return false;
        }
        return 'then' in prototype && 'catch' in prototype && 'finally' in prototype;
    }
    return false;
}