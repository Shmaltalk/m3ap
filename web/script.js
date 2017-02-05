var time = 0;
var beatsArray;
var audio;
var measures = 10;
var currData;
var canvas;
var ctx;
var canvas2;
var ctx2;
var x0;
var y0;
var radius = 1;
var colors = [
    [[226,109,92],[114,61,70],[71,45,48]],
    [[34,83,120], [22, 149, 163], [172, 240, 242], [243, 255, 226], [235, 127, 0]],
    [[33,20,38],[65,64,89],[101,111,140],[155,191,171],[242,239,223]],
    [[255,127,0],[255,217,51],[204,204,82],[143,178,89],[25,43,51]]
];

var dataArray;
var audioCtx;
var analyser;
var currentLines = [];
var lastColor = "";

var canvas3;
var ctx3;


function changeColor() {
    let selColor = 0;
    while (true) {
        selColor = colors[0][Math.floor(Math.random()*3)];
        const candidate = "rgb(" + selColor[0]
                  + ", " + selColor[1]
                  + ", " + selColor[2] + ")";

        if (candidate == lastColor)
            continue;

        break;
    }

    lastColor = "rgb(" + selColor[0]
        + ", " + selColor[1]
        + ", " + selColor[2] + ")";
    
    ctx2.strokeStyle = "rgb(" + selColor[0]
        + ", " + selColor[1]
        + ", " + selColor[2] + ")";
}

function getThickness(ampli, radius) {
    return (ampli / 2048) * (Math.log(radius) / 8);
 }

function symmetricLine(x1, y1, x2, y2, thickness) {
    ctx2.lineWidth = thickness;

    ctx2.beginPath();
    ctx2.moveTo(x1 + x0, y1 + y0);
    ctx2.lineTo(x2 + x0, y2 + y0);
    ctx2.stroke();
    ctx2.closePath();

    ctx2.beginPath();
    ctx2.moveTo(-x1 + x0, -y1 + y0);
    ctx2.lineTo(-x2 + x0, -y2 + y0);
    ctx2.stroke();
    ctx2.closePath();

    ctx2.beginPath();
    ctx2.moveTo(x1 + x0, -y1 + y0);
    ctx2.lineTo(x2 + x0, -y2 + y0);
    ctx2.stroke();
    ctx2.closePath();

    ctx2.beginPath();
    ctx2.moveTo(-x1 + x0, y1 + y0);
    ctx2.lineTo(-x2 + x0, y2 + y0);
    ctx2.stroke();
    ctx2.closePath();
}


function setUpCanvas() {
    canvas3 = document.getElementById("spectro");
    ctx3 = canvas3.getContext('2d');

    
    let overlay = document.getElementById("overlay");
    canvas2 = overlay;
    canvas = document.getElementById('art');
    ctx = canvas.getContext('2d');
    ctx2 = overlay.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    x0 = canvas.width / 2;
    y0 = canvas.height / 2;

    
}

function startDrawing() {
    let e = document.getElementById("exampleRecipientInput");
    console.log(e.options[e.selectedIndex].value);

    const trackNum = e.options[e.selectedIndex].value;
    let audioFile = "";

    if (trackNum == "0") {
        audioFile = "Talk to Me.ogg";
    } else if (trackNum == "2") {
        audioFile = "Wild.ogg";
    } else if (trackNum == "3") {
        audioFile = "Good.ogg";
    } else if (trackNum == "6") {
        audioFile = "Save Tonight.ogg";
    } else if (trackNum == "7") {
        audioFile = "Lights.ogg";
    } else if (trackNum == "8") {
        audioFile = "SELFIE.ogg";
    } else if (trackNum == "9") {
        audioFile = "Cross Your Fingers.ogg";
    } else if (trackNum == "10") {
        audioFile = "Be OK.ogg";
    } else if (trackNum == "11") {
        audioFile = "If I Die Young.ogg";
    } else if (trackNum == "12") {
        audioFile = "Sweet Dreams.ogg";
    } else if (trackNum == "13") {
        audioFile = "Here.ogg";
    }
        
    
    
    var promise = realAPIStuff(trackNum);
    promise.then(function(result) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx2.clearRect(0, 0, canvas.width, canvas.height);
        ctx3.clearRect(0, 0, canvas.width, canvas.height);
        currentLines = [];
        radius = 1;
        
        audioCtx = new AudioContext();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        // music location ogg
        if (audio) audio.pause();
        audio = new Audio("/music/" + audioFile);
        let source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        beatsArray = result;

        audio.addEventListener('loadedmetadata', function() {
            audio.play();
            requestAnimationFrame(draw);
        });
    });
}


var peakWindow = [];
function draw() {
    time = (audio.currentTime);
    analyser.getByteFrequencyData(dataArray);


//    ctx3.clearRect(0, 0, canvas.width, canvas.height);
    ctx3.fillStyle = "#D2D4B3";
    ctx3.fillRect(0, 0, canvas.width, canvas.height);

    
    let avg = 0.0;
    const barWidth = (canvas.width / analyser.frequencyBinCount) / 2;
    for (let c = 0; c < analyser.frequencyBinCount; c++) {
        //avg = Math.max(avg, dataArray[c]);


        
        ctx3.fillStyle = "#FFE1A8";
        const barHeight = (dataArray[c] / 255) * canvas.height;
        ctx3.fillRect(barWidth * c,
                      canvas.height - barHeight,
                      barWidth+1, barHeight);
        
        ctx3.fillRect(canvas.width - (barWidth * c),
                      canvas.height - barHeight,
         barWidth+1, barHeight);
        
        /*ctx3.fillRect(canvas.width - (barWidth * c),
                      0,
         barWidth+1, barHeight);*/
        
        
        avg += Math.pow(dataArray[c], 2);
    }

    avg /= analyser.frequencyBinCount;

    


    
    if (beatsArray[0]) {
        ctx2.clearRect(0, 0, canvas.width, canvas.height);
        /*ctx2.beginPath();
        ctx2.moveTo(0, 100);
        ctx2.lineTo(canvas.width, 100);
        ctx2.lineWidth = avg;
        ctx2.stroke();
        ctx2.closePath();*/

        for (let line of currentLines) {
            let thck = getThickness(avg, radius);
            symmetricLine(line[0], line[1],
                           line[2], line[3], thck);
            symmetricLine(line[2], line[3],
                          line[4], line[5], thck);
                        
        }

        if (time >= beatsArray[0]['timeStamp']) {
            
            currData = beatsArray.shift();
            if (currData['newM'] == true) {
                var circleFillColor = Math.random(5);
                // old: 240 / 2
                radius = (300 / 2) *
                    (1 - Math.cos(Math.PI * currData['timeStamp'] / 30))
                    + 45;
                var startAngle = 0 * Math.PI;
                var endAngle = 2 * Math.PI;
                let lines = Math.floor(Math.random() * 6) + 1;

                /*ctx.beginPath();
                ctx.arc(x0, y0, radius, startAngle, endAngle, true);
                ctx.strokeStyle = "red";
                 ctx.stroke();*/

                changeColor();
                
                ctx.drawImage(canvas2, 0, 0);
                //ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
                //ctx.rect(0, 0, canvas.width, canvas.height);
                //ctx.fill();

                const pixelData = ctx.getImageData(0, 0,
                                                   canvas.width, canvas.height);
                const pixelArray = pixelData.data;
                          

                for (let c = 0; c < pixelArray.length; c += 4) {
                    let red = pixelArray[c];
                    let green = pixelArray[c+1];
                    let blue = pixelArray[c+2];
                    let alpha = pixelArray[c+3];

                    /*if (red > 220 && green > 220 && blue > 220)
                     pixelArray[c+3] = 0;*/

                    
                    pixelArray[c+3] = Math.max(0, pixelArray[c+3] - 7);
                    //pixelArray[c+3] = 0;


                }

                ctx.putImageData(pixelData, 0, 0);
                currentLines = [];

                for (var i = 0; i < lines; i++) {
                    // get a point on the arc
                    var randAngle1 = Math.random() * 90 * Math.PI * .5;
                    var randX1 = Math.cos(randAngle1) * radius;
                    var randY1 = Math.sin(randAngle1) * radius;

                    // get two points within the circle
                    var randAngle2 = Math.random() * 90 * Math.PI * .5;
                    var rSq2 = Math.random() * radius * radius;
                    var randX2 = Math.sqrt(rSq2) * Math.cos(randAngle2);
                    var randY2 = Math.sqrt(rSq2) * Math.sin(randAngle2);

                    var randAngle3 = Math.random() * 90 * Math.PI * .5;
                    var rSq3 = Math.random() * radius * radius;
                    var randX3 = Math.sqrt(rSq3) * Math.cos(randAngle3);
                    var randY3 = Math.sqrt(rSq3) * Math.sin(randAngle3);

                    currentLines.push([randX1, randY1,
                                       randX2, randY2,
                                       randX3, randY3]);
                    
                    //symmetricLine(randX1, randY1, randX2, randY2);
                    //symmetricLine(randX2, randY2, randX3, randY3);
                    
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

function realAPIStuff(trackNum) {

    // beats
    return axios.get('/beats/' + trackNum).then(function (r) {
        return r.data.auftakt_result.click_marks
            .map(function (i) {
                return {"newM": (i.downbeat == "false" ? false : true),
                        "timeStamp": i.time };
            });
    });
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

