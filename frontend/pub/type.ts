export function isString(x: unknown) {
    return (typeof x === 'string' || x instanceof String);
}
export function isArray(x: unknown) {
    return Array.isArray(x);
}

export function isObject(value: unknown) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
}

export function isNumber(x: unknown) {
    return typeof x === "number" || x instanceof Number;
}
export function isBool(x: unknown) {
    return typeof x === "boolean" || x instanceof Boolean;
}
export function isDate(x: unknown) {
    return x instanceof Date;
}
export function formatDate(date: Date | unknown) {
    if (isDate(date))
        return (<Date>date).toLocaleDateString(navigator.language, { year: "numeric", month: "long", day: "numeric" });
    return date;
}
export function formatDateTime(date: Date | unknown) {
    if (isDate(date))
        return (<Date>date).toLocaleDateString(navigator.language, { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" });
    return date;
}

export class Stack<T> {
    private storage: T[] = [];

    constructor(private capacity: number = Infinity) { }

    push(item: T): void {
        if (this.size() === this.capacity) {
            throw Error("Stack has reached max capacity, you cannot add more items");
        }
        this.storage.push(item);
    }

    pop(): T | undefined {
        return this.storage.pop();
    }

    peek(): T | undefined {
        return this.storage[this.size() - 1];
    }

    size(): number {
        return this.storage.length;
    }
}

export class Queue<T> {
    private storage: T[] = [];

    constructor(private capacity: number = Infinity) { }

    enqueue(item: T): void {
        if (this.size() === this.capacity) {
            throw Error("Queue has reached max capacity, you cannot add more items");
        }
        this.storage.push(item);
    }
    dequeue(): T | undefined {
        return this.storage.shift();
    }
    peek(): T | undefined {
        return this.storage[0];
    }
    size(): number {
        return this.storage.length;
    }
}