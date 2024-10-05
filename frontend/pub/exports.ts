export * from '../../../../../modules/vode/frontend/index.js';
export * from '../../../../../modules/tools/frontend/index.js';

let globalID = 1;
export function newID() {
    return `vode-${globalID++}`;
}
export function resetID() {
    globalID = 1;
}

export function clone<T>(o: T): T {
    if (!o) return o;
    if (Array.isArray(o)) {
        const c = <any[]>[];
        for (let i = 0; i < o.length; i++) {
            c.push(clone(o[i]));
        }
        return <T>c;
    } else if (typeof o === 'object') {
        const c = <T>{};
        for (const k in o) {
            c[k] = clone(o[k]);
        }
        return c;
    }
    return o;
}


export function newCache<K, V>() {
    const cache = new Map<K, V>();
    const x = {
        get: cache.get,
        cache: (key: K, fetch: () => V) => {
            if (cache.has(key)) return cache.get(key);
            const value = fetch();
            cache.set(key, value);
            return value;
        },
        has: cache.has,
        delete: cache.delete,
    };
    Object.defineProperty(x, "_cache", { enumerable: false, configurable: false, writable: false, value: cache });
    return x;
}

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

