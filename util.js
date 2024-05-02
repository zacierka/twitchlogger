function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function minutesToMilliseconds(minutes) {
    return minutes * 60000; // 1 minute = 60,000 milliseconds
}

function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}


module.exports = minutesToMilliseconds, minutesToMilliseconds, isNumber
