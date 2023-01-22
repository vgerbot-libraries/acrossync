export type PromiseType<T> = T extends Promise<unknown> ? T : Promise<T>;
export type ArgumentArray = ArrayLike<any>;
