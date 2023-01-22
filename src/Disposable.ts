/**
 * @description Class that provides the basic implementation for disposable objects.
 * @author <a href="https://github.com/y1j2x34">JianXin Yang</a>
 */
export class Disposable {
    private hooks: Array<() => void> = [];
    #disposed: boolean = false;
    /**
     * @description Whether the object has been disposed of.
     * @type {boolean}
     */
    public get disposed() {
        return this.#disposed;
    }

    /**
     * @description Invokes a callback function or dispose a Disposable when this object is disposed.
     * Callbacks and Disposable instances invoked (or disposed) in the order in which they were added.
     * If a callback of Disposable instanceof is added to an already disposed Disposable,
     * it will be called (disposed) immediately.
     * @param {( Disposable |(function():void))} disposable The callback function or Disposable instance.
     */
    addDisposable(disposable: (() => void) | Disposable) {
        if (this.disposed) {
            if(disposable instanceof Disposable) {
                disposable.dispose();
            } else {
                disposable();
            }
            return;
        }
        if (disposable instanceof Disposable) {
            if (disposable === this || disposable.disposed) {
                return;
            }
            this.hooks.push(() => {
                disposable.dispose();
            });
        } else {
            this.hooks.push(disposable);
        }
    }

    /**
     * @description Disposes of the object.
     */
    dispose() {
        if (this.#disposed) {
            return;
        }
        this.hooks.forEach(hook => {
            hook();
        });
    }
}
