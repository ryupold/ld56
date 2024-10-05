export function isDev() {
    return window.location.host === "localhost:3000";
}

export function isNgrok() {
    return window.location.host.endsWith("ngrok-free.app");
}