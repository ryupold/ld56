import { isDev, isNgrok } from "../isdev.js";
import { PREFIX } from "./prefix.js";

export const PROTOCOL = isDev() ? "http://" : "https://";
export const HOST = (isDev() || isNgrok()) ? window.location.host : "ryupold.de";

export const ROOT = () => PROTOCOL + HOST + PREFIX;
export const API = () => ROOT() + "/api/";
export const AUTH = () => API() + "auth/";
export const WS = () => (isDev() ? "ws://" : "wss://") + window.location.host + PREFIX + "/api/auth/";