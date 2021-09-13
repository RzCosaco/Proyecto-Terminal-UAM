const RayCasting = {};

function intersects(A, B, P) {
    if (A[1] > B[1])
        return intersects(B, A, P);
    if (P[1] === A[1] || P[1] === B[1])
        P[1] += 0.0001;
    if (P[1] > B[1] || P[1] < A[1] || P[0] >= Math.max(A[0], B[0]))
        return false;
    if (P[0] < Math.min(A[0], B[0]))
        return true;
    red = (P[1] - A[1]) / (P[0] - A[0]);
    blue = (B[1] - A[1]) / (B[0] - A[0]);
    return red >= blue;
}

function contains(polygon, point) {
    var inside = false;
    var len = polygon.length;
    for (var i = 0; i < len; i++) {
        if (intersects(polygon[i], polygon[(i + 1) % len], point))
            inside = !inside;
    }
    return inside;
}

RayCasting.intersects = intersects;
RayCasting.contains = contains;
module.exports = RayCasting;