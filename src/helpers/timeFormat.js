var minutes, leftSeconds;
export function timeFormat(seconds) {
    if (seconds < 60) {
        return `${seconds} sec`;
    } else {
        minutes = Math.floor(seconds / 60);
        leftSeconds = seconds - minutes * 60;
        return `${minutes} min ${leftSeconds} sec`
    }
}
