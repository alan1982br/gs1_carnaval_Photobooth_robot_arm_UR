/*___________________________MACHINA ROBOT CONNECTION______________________________________________________*/

const WebSocket = require('ws');
let ws;
const Robot = require('../machina.js').Robot;
let bot = new Robot(null);


function initConnectionRobotws(){
    ws = new WebSocket('ws://127.0.0.1:6999/Bridge');
    ws.on('open', function open() {
        // ws.send('something');
      bot = new Robot(ws);
      console.log('WebSocket machina  websocket connection open ');
      ws.addEventListener('error', function (m) { log("error websocket connection", m); });

            ws.on('message', function incoming(data) {
                let json;
                try {
                    json = JSON.parse(data);
                    console.log(json);
                } catch (e) {
                    console.log(data);
                }
            });
      recursiveAsyncReadLine();
    //  sendCommand('writedigital(1,true)');
  });

}
 
function sendCommand(answer){
    ws.send(answer);

}

function sendCommandPreset(answer){

    if (answer == "home") {
        ws.send("SpeedTo(200);");
        ws.send("AxesTo(0,0,0,0,90,0);");

    } else if (answer == "default") {
        ws.send("SpeedTo(300);");
        ws.send("AxesTo(-91.71,-98.96,-126.22,-46.29,91.39,358.22);");
    }
    else if (answer == "position") {
        bot.AxesTo(0, -90, -90, -90, 90, 90);
        bot.AxesTo(0, -90, -120, -60, -90, -180);
        bot.AxesTo(0, -90, -90, -90, 90, 90);
        bot.AxesTo(0, -90, -120, -60, -90, -180);
        bot.AxesTo(0, 0, 0, 0, 0, 0);
        bot.AxesTo(0, -90, -90, -90, 90, 90);
        bot.AxesTo(0, -90, -120, -60, -90, -180);
        bot.AxesTo(0, 0, 0, 0, 0, 0);
        bot.AxesTo(0, -90, -90, -90, 90, 90);
        bot.AxesTo(0, -90, -120, -60, -90, -180);
        bot.AxesTo(0, 0, 0, 0, 0, 0);

    }
}

var readline = require('readline');
var log = console.log;
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let inclination = -1;

var recursiveAsyncReadLine = function() {
    rl.question('Type here: ', answer => {

        if (answer == "exit") {
            process.exit();
        } else if (answer == "writedigital") {
            ws.send("writedigital(1,false)");

        } else if (answer == "home") {
            ws.send("SpeedTo(200);");
            ws.send("AxesTo(0,0,0,0,90,0);");

        } else if (answer == "default") {
            ws.send("SpeedTo(300);");
            ws.send("AxesTo(-91.71,-98.96,-126.22,-46.29,91.39,358.22);");

        }   else if (answer == "position") {
            bot.AxesTo(0, -90, -90, -90, 90, 90);
            bot.AxesTo(0, -90, -120, -60, -90, -180);
       
     

        } else if (answer == "up") {
            inclination += 0.5;

        } else if (answer == "down") {
            inclination -= 0.5;

        } else if (answer == "bowl") {
            bot.TransformTo(745, -160, 570, 0, -1, 0, 1, 0, 0);

            for (let i = 0; i < 8; i++) {
                bot.Rotate(0, 0, 1, 45);
            }

            for (let i = 0; i < 8; i++) {
                bot.Rotate(0, 0, 1, -45);
            }



        } else {
            ws.send(answer);
        }

         log(`Got it! Doing: "${answer}"`);
        recursiveAsyncReadLine();
    });
};