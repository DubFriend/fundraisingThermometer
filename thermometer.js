/*

 * * * Foofurple's HTML5 Simple Fundraising Thermometer * * *

This website / Internet application, comprising the files:

 - index.html
 - thermometer.js
 - style.css

is dedicated to the Public Domain and may be used freely by anyone
for any purpose.

*/

var createFundraisingThermometer = function(fig) {
    "use strict";
    fig = fig || {};

    var copy = function (JSONCompatibleObject) {
        return JSON.parse(JSON.stringify(JSONCompatibleObject));
    };

    var foreach = function (collection, callback) {
        for(var i in collection) {
            if(collection.hasOwnProperty(i)) {
                callback(collection[i], i, collection);
            }
        }
    };

    var maximum = function () {
        var max = arguments[0];
        foreach(arguments, function (arg) {
            if(arg > max) {
                max = arg;
            }
        });
        return max;
    };

    var minimum = function () {
        var min = arguments[0];
        foreach(arguments, function (arg) {
            if(arg < min) {
                min = arg;
            }
        });
        return min;
    };

    var union = function () {
        var united = {};
        foreach(arguments, function (object) {
            foreach(object, function (value, key) {
                united[key] = value;
            });
        });
        return united;
    };

    var mixinPubSub = function (object) {
        object = object || {};
        var topics = {};

        object.publish = function (topic, data) {
            foreach(topics[topic], function (callback) {
                callback(data);
            });
        };

        object.subscribe = function (topic, callback) {
            topics[topic] = topics[topic] || [];
            topics[topic].push(callback);
        };

        object.unsubscribe = function (callback) {
            foreach(topics, function (subscribers) {
                var index = subscribers.indexOf(callback);
                if(index !== -1) {
                    subscribers.splice(index, 1);
                }
            });
        };

        return object;
    };


    // The object returned by this function
    var that = mixinPubSub();

    // The HTML id of the container that the thermometer is rendered into
    var containerID = fig.containerHTMLid;
    // Reference to the thermometers HTML canvas element (set by the init method)
    var canvas;
    // Context of the canvas.
    var ctx;

    var container = document.getElementById(containerID);

    // Data that is configurable at runtime via this objects set method.
    var data = {
        color: fig.color || "blue",
        lineColor: fig.lineColor || "black",
        textColor: fig.textColor || "black",
        targetAmount: fig.targetAmount || 100,
        targetAmountLabel: fig.targetAmountLabel || "Target: ",
        amountSoFar: fig.amountSoFar || 50,
        amountSoFarLabel: fig.amountSoFarLabel || "",
        currency: fig.currency || "$"
    };

    var canvasWidth = fig.width || 240;

    // Scale the rendering based on the canvas width
    var scale = canvasWidth / 240;

    var canvasHeight = 450 * scale;

    // Bulb dimensions
    var bulbX = 100 * scale;    // x-coordinate of the bulb center
    var bulbY = 400 * scale;    // y-coordinate of the bulb center
    var bulbR = 35 * scale;     // bulb radius

    // Dimensions of the rectangular shaft of the thermometer
    var rectX1 = 85 * scale;
    var rectY1 = 70 * scale;
    var rectWidth = 30 * scale;     // Even number
    var rectHeight = 300 * scale;
    var rectY2 = rectY1 + rectHeight;

    // Dimensions of the rounded top of the thermometer shaft
    var topCircleX = bulbX;
    var topCircleY = rectY1;
    var topCircleR = rectWidth/2;

    // Tick marks along thermometer shaft
    var tickX1 = rectX1+(10 * scale);
    var tickX2 = rectX1+(30 * scale);
    var smallTickX1 = rectX1+(20 * scale);
    var smallTickX2 = rectX1+(30 * scale);

    function getY(fraction) {
        var deltaY = fraction * rectHeight;
        var Y = parseInt(rectY2 - deltaY);
        return Y;
    }

    // Draw canvas
    function draw(fig) {
        fig = fig || {};

        // Clear existing image
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        ctx.textAlign = "left";

        // Get colour
        var color = that.get("color");

        // Thermometer bulb
        ctx.beginPath();
        ctx.arc(bulbX, bulbY, bulbR, 0, 2*Math.PI, false);
        ctx.fillStyle= color;
        ctx.fill();
        ctx.strokeStyle=that.get("lineColor");
        ctx.lineWidth=4 * scale;
        ctx.stroke();

        // Thermometer shaft (white background)
        ctx.beginPath();
        ctx.rect(rectX1, rectY1, rectWidth, rectHeight);
        ctx.fillStyle= '#fff';
        ctx.fill();

        // Curved bit at top of thermometer shaft
        ctx.beginPath();
        ctx.arc(topCircleX, topCircleY, topCircleR, Math.PI, 2*Math.PI, false);
        ctx.fill();
        ctx.stroke();

        // Thermometer outline - left
        ctx.moveTo(rectX1,rectY1);
        ctx.lineTo(rectX1,rectY1+rectHeight);
        ctx.stroke();

        // Thermometer outline - right
        ctx.moveTo(rectX1+rectWidth,rectY1);
        ctx.lineTo(rectX1+rectWidth,rectY1+rectHeight);
        ctx.stroke();

        // The coloured bar indicating the 'temperature'
        var amountSoFar = that.get("amountSoFar");
        var targetAmount = that.get("targetAmount");
        var fractionOfTotal = amountSoFar / targetAmount;
        var y = getY(fractionOfTotal);
        var colorRectHeight = parseInt(fractionOfTotal * rectHeight);
        ctx.beginPath();

        // Stroke is 4px, 2px of which covers up what's underneath,
        // And rect is a little longer than it needs to be, going into bulb
        ctx.rect(rectX1+(2*scale), y, rectWidth-(4*scale), colorRectHeight+(5*scale));
        ctx.fillStyle = color;
        ctx.fill();

        // Tick markers
        ctx.beginPath();    
        ctx.moveTo(tickX1,rectY1);
        ctx.lineTo(tickX2,rectY1);
        ctx.stroke();

        var tick8Y = getY(0.8);
        ctx.moveTo(tickX1,tick8Y);
        ctx.lineTo(tickX2,tick8Y);
        ctx.stroke();

        var tick6Y = getY(0.6);
        ctx.moveTo(tickX1,tick6Y);
        ctx.lineTo(tickX2,tick6Y);
        ctx.stroke();

        var tick4Y = getY(0.4);
        ctx.moveTo(tickX1,tick4Y);
        ctx.lineTo(tickX2,tick4Y);
        ctx.stroke();

        var tick2Y = getY(0.2);
        ctx.moveTo(tickX1,tick2Y);
        ctx.lineTo(tickX2,tick2Y);
        ctx.stroke();

        // Small ticks
        var smallTick9Y = getY(0.9);
        ctx.moveTo(smallTickX1,smallTick9Y);
        ctx.lineTo(smallTickX2,smallTick9Y);
        ctx.lineWidth=(2 * scale);
        ctx.stroke();

        var smallTick7Y = getY(0.7);
        ctx.moveTo(smallTickX1,smallTick7Y);
        ctx.lineTo(smallTickX2,smallTick7Y);
        ctx.stroke();

        var smallTick5Y = getY(0.5);
        ctx.moveTo(smallTickX1,smallTick5Y);
        ctx.lineTo(smallTickX2,smallTick5Y);
        ctx.stroke();

        var smallTick3Y = getY(0.3);
        ctx.moveTo(smallTickX1,smallTick3Y);
        ctx.lineTo(smallTickX2,smallTick3Y);
        ctx.stroke();

        var smallTick1Y = getY(0.1);
        ctx.moveTo(smallTickX1,smallTick1Y);
        ctx.lineTo(smallTickX2,smallTick1Y);
        ctx.stroke();

        // Write out the 'temperature'
        ctx.font = maximum(Math.ceil(22*scale), 10) + "px Arial";
        ctx.fillStyle=that.get("textColor");
        var label = "" + that.get("amountSoFarLabel") + that.get("currency") + that.get("amountSoFar");
        ctx.fillText(label, (130 * scale), y);
        
        // Write out the target amount
        var label2 = that.get("targetAmountLabel") + that.get("currency") + that.get("targetAmount");
        ctx.textAlign = "center";
        ctx.fillText(label2, bulbX, (30*scale));
    }

    that.get = function(key) {
        return key ? copy(data[key]) : copy(data);
    };

    that.set = function(newData) {
        data = union(data, newData);
        that.publish("change", that.get());
    };

    canvas = document.createElement("canvas");
    canvas.setAttribute("width",canvasWidth);
    canvas.setAttribute("height",canvasHeight);
    container.appendChild(canvas);
    
    ctx = canvas.getContext("2d");

    that.subscribe("change", draw);
    
    draw();

    return that;
};
