'use strict';
/* global Point: true */
/* global Vec: true */
/* global animation: true */
/* global world: true */
/* global clamp: true */

//Boid parameters and initial weights
//-----------------------------------------------------------------------------------
var boidWeights = {
    separation: 2,
    alginment: 1,
    cohesion: 1,
    obstacle: 10,
    predators: 9
};

var boidParameters = {
    radius: 2.0,
    viewDistance: 50.0,
    separationDistance: 25.0,
    maxSpeed: 2.0,
    maxForce: 0.03
};

//Predator parameters and initial weights
//-----------------------------------------------------------------------------------
var predatorParameters = {
    radius: 2.0,
    viewDistance: 70,
    separationDistance: 25.0,
    maxSpeed: 2.0,
    maxForce: 0.03
};

var predatorWeights = {
    cohesion: 1,
    obstacle: 10,
};

//Boid class
//-----------------------------------------------------------------------------------
Boid.prototype.parameters = boidParameters;
Boid.prototype.weights = boidWeights;

function Boid(x0, y0, dx0, dy0) {

    this.pos = new Point(x0, y0);
    this.dir = new Vec(dx0, dy0);
    this.dir_next = new Vec(dx0, dy0);

    this.r = this.parameters.radius;

    this.separationDistance = this.parameters.separationDistance;
    this.separationDistance2 = Math.pow(this.separationDistance, 2);

    this.viewDistance = this.parameters.viewDistance;
    this.viewDistance2 = Math.pow(this.viewDistance, 2);
}

Boid.prototype.draw = function (context) {

    //Circle
    context.moveTo(this.pos.x+this.r,this.pos.y);
    context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
    
    //Line pointing in direction of movement
    context.moveTo(this.pos.x, this.pos.y);
    context.lineTo(this.pos.x + this.dir.x * 5, this.pos.y + this.dir.y * 5);
};

Boid.prototype.drawViewField = function(context){

    //Field of view
    context.moveTo(this.pos.x+this.viewDistance,this.pos.y);
    context.arc(this.pos.x, this.pos.y, this.viewDistance, 0, 2 * Math.PI);

    //Separation distance
    context.moveTo(this.pos.x+this.separationDistance,this.pos.y);
    context.arc(this.pos.x, this.pos.y, this.separationDistance, 0, 2 * Math.PI);
};

Boid.prototype.move = function () {

    this.pos.x = (this.pos.x + this.dir.x) % animation.w;
    this.pos.y = (this.pos.y + this.dir.y) % animation.h;

    if (this.pos.x<0) {
        this.pos.x = animation.w + this.pos.x;
    }

    if (this.pos.y < 0) {
        this.pos.y = animation.h + this.pos.y;
    }
};

Boid.prototype.updateDirection = function (getSqDistance) {

    var neighbours = [];
    var close = [];

    var velocity = new Vec(this.dir.x, this.dir.y);
    var acceleration = new Vec(0,0);

    this.getNeighbours(neighbours, close, getSqDistance);

    var sep = this.separation(close, velocity);
    sep.scale(this.weights.separation);

    var align = this.alignment(neighbours, velocity);
    align.scale(this.weights.alginment);

    var coh = this.cohesion(neighbours);
    coh.scale(this.weights.cohesion);

    var obstacle = this.avoidObstacle();
    obstacle.scale(this.weights.obstacle);

    var flee = this.flee();
    flee.scale(this.weights.predators);

    acceleration.add(sep).add(align).add(coh).add(obstacle).add(flee);
    
    //Change velocity with accelleration
    velocity.add(acceleration);
    velocity.limitTo(this.parameters.maxSpeed);
    
    this.dir_next.x = velocity.x;
    this.dir_next.y = velocity.y;
};

Boid.prototype.updatePosition = function () {
    this.dir.x = this.dir_next.x;
    this.dir.y = this.dir_next.y;
    this.move();
};

Boid.prototype.getNeighbours = function (neighbours,close,getSqDistance) {

    for (var i = 0; i < world.boids.length; i++) {

        var distance = getSqDistance(i);

        if (distance > 0) {
            if (distance < this.viewDistance2) {
                neighbours.push(world.boids[i]);
            }

            if(distance < this.separationDistance2){
                close.push(world.boids[i]);
            }
        }
    }
};

Boid.prototype.steerToTarget = function (target) {
    var desired = Vec.difference(target, this.pos);

    desired.normalize();
    desired.scale(this.parameters.maxSpeed);

    var steer = Vec.difference(desired, this.dir);
    steer.limitTo(this.parameters.maxForce);

    return steer;
};

Boid.prototype.steerToDesired = function (desired,v) {
    desired.normalize();
    desired.scale(this.parameters.maxSpeed);
    desired.sub(v);
    desired.limitTo(this.parameters.maxForce);
};

Boid.prototype.cohesion = function (neighbours) {
    //Cohesion, a boid will steer towards the average position of other boids close to it.
    var r_c = new Vec(0, 0);
    var N = neighbours.length;

    if (N === 0) return r_c; 

    for (var i = 0; i < N; i++) {
        r_c.add(neighbours[i].pos);
    }

    r_c.scale(1.0 / N);

    return this.steerToTarget(r_c);
};

Boid.prototype.separation = function (neighbours,v) {
    
    var N = neighbours.length;

    var v_s = new Vec(0, 0);

    if (N === 0) return v_s;

    for (var i = 0; i < N; i++) {
        var distance = Point.distance(this.pos, neighbours[i].pos);
        var difference = Vec.difference(this.pos, neighbours[i].pos);

        var testVec = new Vec(difference.x, difference.y);
        difference.scale(1.0 / Math.pow(distance,2));

        v_s.add(difference);
    }

    v_s.scale(1.0 / N);

    if (v_s.length() > 0) {
        this.steerToDesired(v_s, v);
    }

    return v_s;
};

Boid.prototype.alignment = function (neighbours,v) {
    //Alignment, a boid will steer towards the average heading of other boids close to it.

    var v_a = new Vec(0, 0);
    var N = neighbours.length;

    if (N === 0) return v_a;

    for (var i = 0; i < N; i++) {
        v_a.add(neighbours[i].dir);
    }

    v_a.scale(1.0 / N);

    if (v_a.length() > 0) {
        this.steerToDesired(v_a, v);
    }

    return v_a;
};

Boid.prototype.flee = function () {

    var localPredators = [];

    for (var i = 0; i < world.predators.length; i++) {
        if (Point.distance(world.predators[i].pos, this.pos) < this.viewDistance) {
            localPredators.push(world.predators[i]);
        }
    }

    var N = localPredators.length;

    if (N === 0) return new Vec(0, 0);

    var r_c = new Vec(0, 0);

    for (i in localPredators) {
        r_c.add(localPredators[i].pos);
    }

    r_c.scale(1.0 / N);

    var force = this.steerToTarget(r_c);
    force.scale(-1);

    return force;
};

Boid.prototype.avoidObstacle = function () {

    var N = world.obstacles.length;

    for (var i = 0; i < N; i++) {

        var r = world.obstacles[i].pos.getDiffVector(this.pos);

        if (r.length() < (this.viewDistance + world.obstacles[i].r)) {
            
            //Safetydistance is how long z shoud be
            var safetyDistance = world.obstacles[i].r*1.40;
            var theta = Vec.angle(r,this.dir);
            var z = r.length() * Math.sin(theta);

            if (Math.abs(z) < safetyDistance) {

                if (Math.abs(theta) < Math.PI / 2) {
                    
                    var ratio = safetyDistance / r.length();

                    var newTheta = Math.asin(clamp(ratio,-1,1));

                    newTheta = Math.abs(theta - newTheta) * (theta > 0 ? 1 : -1);

                    var newDir = new Vec(0, 0);

                    newDir.x = this.dir.x * Math.cos(newTheta) - this.dir.y * Math.sin(newTheta);
                    newDir.y = this.dir.x * Math.sin(newTheta) + this.dir.y * Math.cos(newTheta);

                    this.steerToDesired(newDir, this.dir);
                    return newDir;
                }

            }            
        }
    }

    return new Vec(0, 0);
};

//Boid predator class - inherits from Boids
//-----------------------------------------------------------------------------------
Predator.prototype = new Boid();
Predator.prototype.parameters = predatorParameters;
Predator.prototype.weights = predatorWeights;

function Predator(x0, y0, dx0, dy0) {
    Boid.call(this, x0, y0, dx0, dy0);//Call parent constructor
}

Predator.prototype.updateDirection = function (getPredatorDistance) {

    var neighbours = [];
    var close = [];

    //Feed current velocity to the functions
    var velocity = new Vec(this.dir.x, this.dir.y);

    //Reset each iteration
    var acceleration = new Vec(0,0);

    this.getNeighbours(neighbours, close,getPredatorDistance);

    var coh = this.cohesion(neighbours, velocity);
    coh.scale(this.weights.cohesion);

    var obstacle = this.avoidObstacle();
    obstacle.scale(this.weights.obstacle);

    acceleration.add(coh).add(obstacle);
    
    //Change velocity with accelleration
    velocity.add(acceleration);
    velocity.limitTo(this.parameters.maxSpeed);
    
    this.dir_next.x = velocity.x;
    this.dir_next.y = velocity.y;
};