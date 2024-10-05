export function timeString(timestamp: number) {
    const d = new Date(timestamp * 1000);
    return `${d.getFullYear()}-${d.getMonth() < 10 ? '0' + d.getMonth().toString() : d.getMonth().toString()}-${d.getDate() < 10 ? '0' + d.getDate().toString() : d.getDate().toString()} ${d.getHours() < 10 ? '0' + d.getHours() : d.getHours()}:${d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()}:${d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()}`;
}

export function deltaTimeString(deltaUnix: number) {
    return `${Math.floor(deltaUnix / (60 * 60 * 24 * 7))}w ${deltaUnix % (60 * 60 * 24) === 0 ? "" : Math.round(((deltaUnix / (60 * 60 * 24 * 7)) - Math.floor(deltaUnix / (60 * 60 * 24 * 7))) * 7)}d`;
}

export function detlaTimeToNowString(target: Date) {
    return deltaTimeString(new Date().getTime() / 1000 - target.getTime() / 1000);
}