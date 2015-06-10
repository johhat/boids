'use strict';
/* global $: true */
/* global animation: true */
/* global boidWheights: true */

//Slider for selecting initial number of boids
//---------------------------------------------
$('#numBoidsSlider').slider({
    min: 0,
    max: 400,
    step: 10,
    value: animation.numBoids
});

$('#numBoidsVal').text(animation.numBoids);

$('#numBoidsSlider').on('slide', function (slideEvt) {
    $('#numBoidsVal').text(slideEvt.value);
    animation.numBoids = slideEvt.value;
});

//Sliders for weights
//--------------------
$('#slider1').slider({
    min: 0,
    max: 20,
    step: 0.1,
    value: boidWheights.separation
});

$('#slider1val').text(boidWheights.separation);

$('#slider1').on('slide', function (slideEvt) {
    $('#slider1val').text(slideEvt.value);
    boidWheights.separation = slideEvt.value;
});

$('#slider2').slider({
    min: 0,
    max: 20,
    step: 0.1,
    value: boidWheights.alginment
});
$('#slider2').on('slide', function (slideEvt) {

$('#slider2val').text(boidWheights.alginment);
    $('#slider2val').text(slideEvt.value);
    boidWheights.alginment = slideEvt.value;
});

$('#slider3').slider({
    min: 0,
    max: 20,
    step: 0.1,
    value: boidWheights.cohesion
});
$('#slider3val').text(boidWheights.cohesion);

$('#slider3').on('slide', function (slideEvt) {
    $('#slider3val').text(slideEvt.value);
    boidWheights.cohesion = slideEvt.value;
});

$('#slider4').slider({
    min: 0,
    max: 20,
    step: 0.1,
    value: boidWheights.obstacle
});
$('#slider4val').text(boidWheights.obstacle);

$('#slider4').on('slide', function (slideEvt) {
    $('#slider4val').text(slideEvt.value);
    boidWheights.obstacle = slideEvt.value;
});

$('#slider5').slider({
    min: 0,
    max: 20,
    step: 0.1,
    value: boidWheights.predators
});

$('#slider5val').text(boidWheights.predators);

$('#slider5').on('slide', function (slideEvt) {
    $('#slider5val').text(slideEvt.value);
    boidWheights.predators = slideEvt.value;
});