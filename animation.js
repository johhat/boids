'use strict';
/* global Boid: true */
/* global Predator: true */
/* global Point: true */
/* global Obstacle: true */

/*
    A note about the code: This does not intend to show js best practices.
    If i were to do this over again, I would make less use of global variables,
    and split up the animation "class". Having 'use strict' in global scope is also
    usually a no-go.
*/

//Global world arrays
//-----------------------------------------------------------------------------------
var world = {
    boids: [],
    obstacles: [],
    predators: []
};

//Animation
//-----------------------------------------------------------------------------------
var animation = {
    cvs: null,
    ctx: null,
    w: null,
    h: null,
    fps: 0,
    lastCalledTime: null,
    keepGoing: false,
    showViewField: false,
    printFps: true,
    numBoids: 200
};

animation.init = function () {

    this.lastCalledTime = Date.now();
    this.cvs = document.getElementById('boidsCanvas');
    this.ctx = this.cvs.getContext('2d');

    this.cvs.height = Math.floor(window.innerHeight*0.9);

    var offset = document.getElementById('canvasContainer').offsetWidth;
    this.cvs.width = offset - 40;

    this.w = this.cvs.width;
    this.h = this.cvs.height;

    this.reset();
    this.start();
};

animation.reset = function (){

    animation.stop();

    console.log('Canvas w:' + this.w);
    console.log('Canvas h:' + this.h);

    this.ctx.clearRect(0, 0, this.w, this.h);

    //Clear arrays
    world.boids = [];
    world.obstacles = [];
    world.predators = [];

    for (var i = 0; i < animation.numBoids; i++) {
        animation.addBoid();
    }
    this.loop();
};

animation.loop = function (){
    
    animation.ctx.clearRect(0, 0, animation.w, animation.h);

    for (var i = 0; i < world.obstacles.length; i++) {
        world.obstacles[i].render(animation.ctx,false);
    }

    //The rendering of viewfields will be a bit off, since this happens before the position is updated.
    //As long as max velocity is small, this should not be a problem.
    if (animation.showViewField) {

        animation.ctx.beginPath();
        animation.ctx.strokeStyle = 'lightgreen';

        for (i = 0; i < world.boids.length; i++) {
            world.boids[i].drawViewField(animation.ctx);
        }

        animation.ctx.stroke();
    }

    if (animation.showViewField) {

        animation.ctx.beginPath();
        animation.ctx.strokeStyle = 'orange';

        for (i = 0; i < world.predators.length; i++) {
            world.predators[i].drawViewField(animation.ctx);
        }

        animation.ctx.stroke();
    }

    {
        var matrix = preComputeDistancesSquared(world.boids);

        for (i = 0; i < world.boids.length; i++) {
            world.boids[i].updateDirection(getSquaredDistance(i,matrix));
        }
    }

    for (i = 0; i < world.predators.length; i++) {
        world.predators[i].updateDirection(getPredatorDistance(world.predators[i],world.boids));
    }

    {
        //Update position, draw and render boids
        //-------------------------------------
        //A render-function for the boids class would be less messy, but way to slow

        animation.ctx.beginPath();
        animation.ctx.fillStyle = 'blue';
        animation.ctx.strokeStyle = 'black';

        for (i = 0; i < world.boids.length; i++) {
            world.boids[i].updatePosition();
            world.boids[i].draw(animation.ctx);
        }

        animation.ctx.fill();
        animation.ctx.stroke();
    }

    {
        //Update position, draw and render predators
        //-------------------------------------
        animation.ctx.beginPath();
        animation.ctx.fillStyle = 'red';
        animation.ctx.strokeStyle = 'red';

        for (i = 0; i < world.predators.length; i++) {
            world.predators[i].updatePosition();
            world.predators[i].draw(animation.ctx);
        }

        animation.ctx.fill();
        animation.ctx.stroke();
    }

    //Whrite FPS to use for optimizing
    if (animation.printFps){
        var delta = (new Date().getTime() - animation.lastCalledTime) / 1000;
        animation.lastCalledTime = Date.now();
        animation.fps = 1 / delta;
        animation.ctx.fillStyle = 'black';
        animation.ctx.font = 'normal 16pt Arial';
        animation.ctx.fillText('FPS:' + animation.fps.toFixed(0), 10, 30);
    }

    if (animation.keepGoing) window.requestAnimationFrame(animation.loop);
};

animation.start = function () {
    if (!this.keepGoing) {
        this.keepGoing = true;
        window.requestAnimationFrame(this.loop);
    }
};

animation.stop = function () {
    this.keepGoing = false;
};

animation.addBoid = function(){
    var x = Math.floor(Math.random() * this.w);
    var y = Math.floor(Math.random() * this.h);
    var dx = Math.floor(Math.random() * 2 - 1);
    var dy = Math.floor(Math.random() * 2 - 1);

    var boid = new Boid(x, y, dx, dy,false);
    world.boids.push(boid);
    boid.draw(this.ctx, this.showViewField);
};

animation.addObstacle = function () {
    var obstacle = new Obstacle(
        Math.floor(Math.random() * animation.w*0.8 + animation.w*0.1),
        Math.floor(Math.random() * animation.h*0.8 + animation.h*0.1),
        Math.floor(Math.random() * 10 + 10));
    world.obstacles.push(obstacle);
    obstacle.render(animation.ctx, false);
};

animation.removeObstacles = function(){
    while(world.obstacles.length){
        world.obstacles.pop();
    }
};

animation.addPredator = function () {
    var x = Math.floor(Math.random() * this.w);
    var y = Math.floor(Math.random() * this.h);
    var dx = Math.floor(Math.random() * 2 - 1);
    var dy = Math.floor(Math.random() * 2 - 1);

    var predator = new Predator(x, y, dx, dy);
    world.predators.push(predator);
};

animation.removePredators = function () {
    while (world.predators.length) {
        world.predators.pop();
    }
};

animation.toggleViewfieldRendering = function (event) {
    this.showViewField = event.checked;
    console.log('showViewField= ', this.showViewField);
};

animation.renderVector = function (point, vector, context, color) {
    context.beginPath();
    context.moveTo(point.x,point.y);
    context.lineTo(point.x + vector.x, point.y + vector.y);
    context.strokeStyle = color;
    context.stroke();
};

animation.init();

//Helper functions to optimize computation of distance squared
//-----------------------------------------------------------------------------------
function preComputeDistancesSquared (boids){

    var N = boids.length;

    var dSquared = new Array(N);

    for (var i = 0; i < N; i++) {

        dSquared[i] = new Array(N);
        dSquared[i][i] = 0;

        for (var j = i+1; j < N; j++) {
            //Only upper half is filled
            dSquared[i][j] = Point.distance2(boids[i].pos,boids[j].pos);
        }
    }

    return dSquared;
}

function getSquaredDistance(i,matrix){
    //Closure for keeping array of precomputed values squared
    //Note use of min/max to assure that the correct portion of the array is accessed
    return function(j){
        return matrix[Math.min(i,j)][Math.max(i,j)];
    };
}

function getPredatorDistance(predator,boids){
    //Closure for getting distance squared from given predator to boid j
    return function(j){
        return Point.distance2(predator.pos,boids[j].pos);
    };
}