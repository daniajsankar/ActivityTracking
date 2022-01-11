export function getDistanceFromLatLonInM(position1, position2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(position2.lat - position1.lat);  // deg2rad below
    var dLon = deg2rad(position2.long - position1.long);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(position1.lat)) * Math.cos(deg2rad(position2.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return parseInt(d * 1000, 0);
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

export function convertMetersToSteps(meters) {
    return parseInt((meters * 1.31233595800525), 0);
}