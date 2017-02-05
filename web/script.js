var time = 0;
var beatsArray;
var audio;
var measures = 10;
var currData;
var canvas;
var ctx;
var x0;
var y0;
var colors = [
    [[34,83,120], [22, 149, 163], [172, 240, 242], [243, 255, 226], [235, 127, 0]],
    [[33,20,38],[65,64,89],[101,111,140],[155,191,171],[242,239,223]],
    [[255,127,0],[255,217,51],[204,204,82],[143,178,89],[25,43,51]]
];

function symmetricLine(x1, y1, x2, y2) {
    const selColor = colors[0][Math.floor(Math.random()*5)];
    console.log(selColor);
    ctx.strokeStyle = "rgb(" + selColor[0]
        + ", " + selColor[1]
        + ", " + selColor[2] + ")";

    
    

    ctx.beginPath();
    ctx.moveTo(x1 + x0, y1 + y0);
    ctx.lineTo(x2 + x0, y2 + y0);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(-x1 + x0, -y1 + y0);
    ctx.lineTo(-x2 + x0, -y2 + y0);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(x1 + x0, -y1 + y0);
    ctx.lineTo(x2 + x0, -y2 + y0);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(-x1 + x0, y1 + y0);
    ctx.lineTo(-x2 + x0, y2 + y0);
    ctx.stroke();
    ctx.closePath();
}


function setUpCanvas() {
    canvas = document.getElementById('art');
    ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    x0 = canvas.width / 2;
    y0 = canvas.height / 2;
}

function startDrawing() {
    var promise = APIStuff();
    promise.then(function(result) {
        beatsArray = result;
        audio = new Audio('../music/Bodyache.ogg');
        audio.addEventListener('loadedmetadata', function() {
            audio.play();
            requestAnimationFrame(draw);
        });
    });
}

function draw() {
    time = (audio.currentTime);
    measure = time/measures; //get from API
    lines = measure*3; //some other formula?
    if (beatsArray[0]) {
        if (time >= beatsArray[0]['timeStamp']) {
            currData = beatsArray.shift();
            if (currData['newM'] == true || true) {
                console.log(currData['timeStamp']);
                var circleFillColor = Math.random(5);
                var radius = 2 * currData['timeStamp'];
                var startAngle = 0 * Math.PI;
                var endAngle = 2 * Math.PI;

                /*ctx.beginPath();
                ctx.arc(x0, y0, radius, startAngle, endAngle, true);
                ctx.strokeStyle = "red";
                ctx.stroke();*/

                for (var i = 0; i < lines; i++) {
                    // get a point on the arc
                    var randAngle1 = Math.random() * Math.PI * .5;
                    var randX1 = Math.cos(randAngle1) * radius;
                    var randY1 = Math.sin(randAngle1) * radius;

                    // get two points within the circle
                    var randAngle2 = Math.random() * Math.PI * .5;
                    var rSq2 = Math.random() * radius * radius;
                    var randX2 = Math.sqrt(rSq2) * Math.cos(randAngle2);
                    var randY2 = Math.sqrt(rSq2) * Math.sin(randAngle2);

                    var randAngle3 = Math.random() * Math.PI * .5;
                    var rSq3 = Math.random() * radius * radius;
                    var randX3 = Math.sqrt(rSq3) * Math.cos(randAngle3);
                    var randY3 = Math.sqrt(rSq3) * Math.sin(randAngle3);

                    console.log(randX1 + ", " + randY1);
                    console.log(randX2 + ", " + randY2);
                    console.log(randX3 + ", " + randY3);
                    console.log("");

                    symmetricLine(randX1, randY1, randX2, randY2);
                    symmetricLine(randX2, randY2, randX3, randY3);
                    
                }
            }
        }
    } else {
        console.log("Thats all folks");
    }

    requestAnimationFrame(draw);
}



function APIStuff() {
    let toR = Q.defer();
    toR.resolve([
        {timeStamp: 2, newM: false},
        {timeStamp: 4, newM: false},
        {timeStamp: 6, newM: false},
        {timeStamp: 8, newM: true},
        {timeStamp: 10, newM: false},
        {timeStamp: 12, newM: false},
        {timeStamp: 14, newM: false},
        {timeStamp: 16, newM: true},
        {timeStamp: 18, newM: false},
        {timeStamp: 20, newM: false},
        {timeStamp: 22, newM: false},
        {timeStamp: 24, newM: true},
        {timeStamp: 26, newM: false},
        {timeStamp: 28, newM: false},
        {timeStamp: 30, newM: false},
        {timeStamp: 32, newM: true},
        {timeStamp: 34, newM: false},
        {timeStamp: 36, newM: false},
        {timeStamp: 38, newM: false},
        {timeStamp: 40, newM: true},
        {timeStamp: 42, newM: false},
        {timeStamp: 44, newM: false},
        {timeStamp: 46, newM: false}
    ]);
    return toR.promise;
}


(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
