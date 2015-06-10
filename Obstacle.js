'use strict';
/* global Point: true */

//Obstacle class
//-----------------------------------------------------------------------------------
function Obstacle(x0, y0, r) {

    this.r = r;
    this.pos = new Point(x0, y0);
}

Obstacle.prototype.render = function (context,safetyDistance) {

    //Build new circle
    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
    context.fillStyle = 'green';
    context.strokeStyle = 'black';
    context.fill();
    context.stroke();

    if (safetyDistance) {
        context.beginPath();
        context.arc(this.pos.x, this.pos.y, this.r * 1.4, 0, 2 * Math.PI);
        context.strokeStyle = 'hotpink';
        context.stroke();
    }
};