'use strict';
//Point class start
//-----------------------------------------------------------------------------------
function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.getDiffVector = function (b) {
    return new Vec(this.x - b.x, this.y - b.y);
};

Point.prototype.add = function (b) {
    this.x += b.x;
    this.y += b.y;
    return this;
};

Point.prototype.sub = function (b) {
    this.x -= b.x;
    this.y -= b.y;
    return this;
};

Point.distance = function (a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

Point.distance2 = function (a, b) {
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
};

//Vector class start
//-----------------------------------------------------------------------------------
function Vec(x, y) {
    this.x = x;
    this.y = y;
}

Vec.prototype.length = function () {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
};

Vec.prototype.scale = function (scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
};

Vec.prototype.normalize = function () {
    var length = this.length();
    if (length !== 0) {
        this.x = this.x / length;
        this.y = this.y / length;
    }
    return this;
};

Vec.prototype.add = function (b) {
    this.x += b.x;
    this.y += b.y;
    return this;
};

Vec.prototype.sub = function (b) {
    this.x -= b.x;
    this.y -= b.y;
    return this;
};

Vec.prototype.limitTo = function (limit) {

    var length = this.length();

    if (length > limit) {
        this.scale(limit / (this.length()));
    }

    return this;
};

Vec.difference = function (a, b) {
    return new Vec(a.x - b.x, a.y - b.y);
};

Vec.dot = function (a, b) {
    return a.x * b.x + a.y * b.y;
};

Vec.crossProduct = function (a, b) {
    return a.x * b.y - b.x * a.y;
};

Vec.angle = function (a,b) {
    //return Math.acos(Vec.dot(a, b) / (a.length() * b.length()));
    return Math.atan2(Vec.crossProduct(a, b), Vec.dot(a, b));
};

//Extra math functions start
//-----------------------------------------------------------------------------------
function clamp(value,min,max) {
    if (value > max) {
        return max;
    }
    else if (value < min) {
        return min;
    }
    return value;
}