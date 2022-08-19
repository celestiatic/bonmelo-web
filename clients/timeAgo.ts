import TimeAgo from "javascript-time-ago";
// English.
import en from "javascript-time-ago/locale/en.json";

export function timeAgoInit() {
    TimeAgo.addDefaultLocale(en);
}