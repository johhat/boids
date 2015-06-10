'use strict';
/* global $: true */
/* global animation: true */
/* global boidWeights: true */

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
    value: boidWeights.separation
});

$('#slider1val').text(boidWeights.separation);

$('#slider1').on('slide', function (slideEvt) {
    $('#slider1val').text(slideEvt.value);
    boidWeights.separation = slideEvt.value;
});

$('#slider2').slider({
    min: 0,
    max: 20,
    step: 0.1,
    value: boidWeights.alginment
});
$('#slider2').on('slide', function (slideEvt) {

$('#slider2val').text(boidWeights.alginment);
    $('#slider2val').text(slideEvt.value);
    boidWeights.alginment = slideEvt.value;
});

$('#slider3').slider({
    min: 0,
    max: 20,
    step: 0.1,
    value: boidWeights.cohesion
});
$('#slider3val').text(boidWeights.cohesion);

$('#slider3').on('slide', function (slideEvt) {
    $('#slider3val').text(slideEvt.value);
    boidWeights.cohesion = slideEvt.value;
});

$('#slider4').slider({
    min: 0,
    max: 20,
    step: 0.1,
    value: boidWeights.obstacle
});
$('#slider4val').text(boidWeights.obstacle);

$('#slider4').on('slide', function (slideEvt) {
    $('#slider4val').text(slideEvt.value);
    boidWeights.obstacle = slideEvt.value;
});

$('#slider5').slider({
    min: 0,
    max: 20,
    step: 0.1,
    value: boidWeights.predators
});

$('#slider5val').text(boidWeights.predators);

$('#slider5').on('slide', function (slideEvt) {
    $('#slider5val').text(slideEvt.value);
    boidWeights.predators = slideEvt.value;
});
