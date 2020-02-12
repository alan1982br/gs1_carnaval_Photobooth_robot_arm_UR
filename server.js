// http://127.0.0.1:9001
// http://localhost:9001

/*___________________________ROBOT CONNECTION______________________________________________________*/

// // Import net module.
var net = require('net');
var socketClient;

// Create and return a net.Server object, the function will be invoked when client connect to this server.

var server = net.createServer(function (client) {

    console.log('Client connect. Client local address : ' + client.localAddress + ':' + client.localPort + '. client remote address : ' + client.remoteAddress + ':' + client.remotePort);

    client.setEncoding('utf-8');
    socketClient = client;
 
    // When receive client data.
    client.on('data', function (data) {

        // Print received client data and length.
        // console.log('Receive client send data : ' + data + ', data size : ' + client.bytesRead);
        console.log('Receive client send data : ' + data);

        switch (data) {
            case "fim_video_1":
                socketClient.write("(0,0)");
                //  stopRecordCamRobot();
                break;
            case "fim_video_2":
                socketClient.write("(0,0)");
                //  stopRecordCamRobot();
                break;
            case "fim_video_3":
                socketClient.write("(0,0)");
                //  stopRecordCamRobot();
                break;

            default:
                break;
        }
 

        //  client.end('Server received data : ' + data + ', send back to client data size : ' + client.bytesWritten);
    });

    // When client send data complete.
    client.on('end', function () {
        console.log('Client disconnect.');

        // Get current connections count.
        try {

            server.getConnections(function (err, count) {
                if (!err) {
                    // Print current connection count in server console.
                    console.log("There are %d connections now. ", count);
                } else {
                    console.error(JSON.stringify(err));
                }
    
            });
            
        } catch (error) {
             console.log(error)
        }
       
    });

    // When client timeout.
    client.on('timeout', function () {
        console.log('Client request time out. ');
    })

});
server.listen(9001, '192.168.1.100');
// Make the server a TCP server listening on port 9999.
// Get server address info.
var serverInfo = server.address();

var serverInfoJson = JSON.stringify(serverInfo);

console.log('TCP server CONTROL ROBOT listen on address : ' + serverInfoJson);

server.on('close', function () {
    console.log('TCP server socket is closed.');
});

server.on('error', function (error) {
    console.error(JSON.stringify(error));
});

/*___________________________SERVER HTTP VIDEO_________________________________________*/
var clientDashBoard = new net.Socket();

clientDashBoard.connect(29999 , '192.168.1.47', function() {
	console.log('Connected');
     clientDashBoard.write('robotmode'+ "\n");
});

clientDashBoard.on('data', function(data) {
	console.log('Received: ' + data);
    //  clientDashBoard.write('quit');
    //	client.destroy(); // kill client after server's response
});

clientDashBoard.on('close', function() {
	console.log('Connection closed');
});

// setTimeout(function(){ 
//     console.log("clientDashBoard")
//     clientDashBoard.write("play" + "\n");

// }, 5000);




/*___________________________SERVER HTTP VIDEO______________________________________________________*/

const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

var server = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');

var port = 3004;
var app;

var actualResponse;

app = server.createServer(serverHandler);
 
app = app.listen(port, process.env.IP || "0.0.0.0", function () {
    var addr = app.address();

    if (addr.address == '0.0.0.0') {
        addr.address = 'localhost';
    }

    app.address = addr.address;

    // console.log(ffmpegInstaller.path, ffmpegInstaller.version);
      console.log("SERVER HTTP VIDEO CONTROL ROBOT listening at", 'http://' + addr.address + ":" + addr.port + '/control_main_robot.html');
      console.log("SERVER HTTP VIDEO listening at", 'http://' + addr.address + ":" + addr.port + '/app');
    
});
 

function serverHandler(request, response) {
 
    actualResponse = response;
 
    var uri = url.parse(request.url).pathname,
    filename = path.join(process.cwd(), uri);
    // console.log('uri >>>>>>>>>>>>>', uri)
   
    var typeAction = ''
    if (uri == '/control_robot' && request.method == 'POST') {
        console.log('POST')
       
        request.on('data', function(data) {
            typeAction += data
            console.log('typeAction ' , typeAction)
try {
    switch (typeAction) {
        case 'btn-dance':
            socketClient.write("(2,0)");
            break;
        case 'btn-home':
            socketClient.write("(0,0)");
            break;
        case 'btn-position-move_1':
            socketClient.write("(1,1)");
            break;
        case 'btn-position-move_2':
            socketClient.write("(1,2)");
            break;
        case 'btn-position-move_3':
            socketClient.write("(1,3)");
            break;
        case 'btn-position-move_3':
            socketClient.write("(1,3)");
            break;
        case 'btn-play-Program':
            clientDashBoard.write("play" + "\n");
            break;
        case 'btn-stop-Program':
            clientDashBoard.write("stop" + "\n");
            break;
        case 'btn-load':
            let command = 'load "venosa mq estados 4 cam.urp"';
            clientDashBoard.write(command + "\n");
            break;
        case 'btn-power-on':
            clientDashBoard.write("power on" + "\n");
            break;
            case 'btn-power-off':
            clientDashBoard.write("power off" + "\n");
            break;
            case 'btn-brake-release':
                clientDashBoard.write("brake release" + "\n");
                break;
            case 'btn-shutdown':
                clientDashBoard.write("shutdown" + "\n");
                break;
        default:
            break;
       
    }
        
    } catch (error) {
        console.log(error)
        request.on('data', function(data) {
            typeAction += data
            console.log('typeAction ' , typeAction)
        });
    }
           
           
        })
     
      }  


    var isWin = !!process.platform.match(/^win/);

    if (filename && filename.toString().indexOf(isWin ? '\\uploadFile' : '/uploadFile') != -1 && request.method.toLowerCase() == 'post') {

        uploadFile(request, response);
        return;
    }
 
    fs.exists(filename, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write('404 Not Found: ' + filename + '\n');
            response.end();
            return;
        }

        if (filename.indexOf('favicon.ico') !== -1) {
            return;
        }

        if (fs.statSync(filename).isDirectory() && !isWin) {
            filename += '/index.html';
        } else if (fs.statSync(filename).isDirectory() && !!isWin) {
            filename += '\\index.html';
        }

        fs.readFile(filename, 'binary', function (err, file) {
            if (err) {
                response.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                response.write(err + '\n');
                response.end();
                return;
            }

            var contentType;

            if (filename.indexOf('.html') !== -1) {
                contentType = 'text/html';
            }

            if (filename.indexOf('.js') !== -1) {
                contentType = 'application/javascript';
            }

            if (contentType) {
                //   console.log('filename >>>>>>>>>>>>>',filename)  
                response.writeHead(200, {
                    'Content-Type': contentType
                });
            } else response.writeHead(200);


            response.write(file, 'binary');
            response.end();
        });
    });
 
}

function stopRecordCamRobot() {
    actualResponse.writeHead(200, getHeaders('Content-Type', 'application/json'));

    actualResponse.write(JSON.stringify({
        status: "fim_video"

    }));

    actualResponse.end();
    return
}

function sendCompleteConvert(response){

    response.writeHead(200, getHeaders('Content-Type', 'application/json'));

    response.write(JSON.stringify({
        status: "complete_convert"

    }));

    // response.end();
    return
}

//___________________________UPLOAD VIDEO SAVE________________________

function uploadFile(request, response) {
    // parse a file upload
    var mime = require('mime');
    var formidable = require('formidable');
    var util = require('util');

    var acutalConvertVideoPath = '';

    var form = new formidable.IncomingForm();

    var dir = !!process.platform.match(/^win/) ? '\\uploads\\' : '/uploads/';

    form.uploadDir = __dirname + dir;
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024;
    form.maxFields = 1000;
    form.multiples = false;

    form.parse(request, function (err, fields, files) {
        // console.log(fields.email);
        var file = util.inspect(files);

        response.writeHead(200, getHeaders('Content-Type', 'application/json'));

        var fileName = file.split('path:')[1].split('\',')[0].split(dir)[1].toString().replace(/\\/g, '').replace(/\//g, '');

        console.log('form >>>>> ', file.name);

        console.log('fields', fields)
        var fileURL = 'http://' + app.address + ':' + port + '/uploads/' + fileName;

       console.log('fileURL: ', fileURL);

        acutalConvertVideoPath = form.uploadDir + fileName;
        let fileNameDate = fields.date + '_' + fileName;

        convertVideo(acutalConvertVideoPath, form.uploadDir, fields.numero, fileNameDate,response).then((data) => {
            console.log('fields.numero', fields.numero)
            console.log('finnished conversion !!!!!!!!!!!!!')
            response.write(JSON.stringify({
                email: fields.email,
                fileURL: fileURL,
                fileName: fileName,
                filenameConvert: fields.numero + '_' + fileNameDate,
                date: fields.date,
                fileBlob: data.toString('base64'),
                numero: fields.numero
            }));
    
           response.end();
        })
 
    });
}

function getHeaders(opt, val) {
    try {
        var headers = {};
        headers["Access-Control-Allow-Origin"] = "https://secure.seedocnow.com";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = true;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";

        if (opt) {
            headers[opt] = val;
        }

        return headers;
    } catch (e) {
        return {};
    }
}

//_______________________________ FFMpeg Convert Video _____________________________________________________________________________

function convertVideo(path, dir, numero, filename, response) {
    return new Promise(function(resolve) {
        console.log('converVideo path= ' ,path   )
        console.log('converVideodir = '  , dir,   )
        console.log('converVideo numero= '  , numero )
        console.log('converVideo filename= '  ,filename )
        ffmpeg(path)
            // set video bitrate
            // .videoBitrate(1080)
            // .withSize('1920x1080')
            // set target codec
            // .videoCodec('mpeg4')
            // set aspect ratio
            // .aspect('16:9')
            // set size in percent
            //  .size('100%')
            // set fps
            // .fps(24)
            // set audio bitrate
            // .audioBitrate('128k')
            // set audio codec
            // .audioCodec('libmp3lame')
            // set number of audio channels
            // .audioChannels(2)

            .withVideoFilter('transpose=2')
            .withSize('1080x1920')
            // set custom option
            //   .addOption('-vtag', 'mpeg4')
            //   // set output format to force
            // .format('mp4')
            // setup event handlers
            .on('end', function () {
                console.log('file has been converted succesfully');
                let filepath = `${dir}/convert/${numero}_${filename}`
                console.log(dir + '\\convert\\' + numero + '_' + filename)
                fs.readFile(filepath, function (err, data) {
                    if (err) throw err;
                    console.log('data', data)
                    resolve(data)
                })
            // sendCompleteConvert(response)
            })
            .on('error', function (err) {
                console.log('an error happened: ' + err.message);
                
            })
            // save to file
            // .save(dir + '\\convert\\' + email + '_' + filename);
            .save(dir + '\\convert\\' + numero + '_' + filename);
    });
}



//_______________________________ DB SQLLITE _____________________________________________________________________________

var express = require("express")
var appSqlLite = express()
var db = require("./database.js")
// var md5 = require("md5")

var bodyParser = require("body-parser");
appSqlLite.use(bodyParser.urlencoded({ extended: false }));
appSqlLite.use(bodyParser.json());

appSqlLite.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    next();
});

var HTTP_PORT = 8000


// Start server
appSqlLite.listen(HTTP_PORT, () => {
    console.log("Server SQLITE running on port %PORT%".replace("%PORT%", HTTP_PORT))

});

appSqlLite.get("/api/users", (req, res, next) => {
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});


appSqlLite.get("/api/user/:id", (req, res, next) => {
    var sql = "select * from user where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    });
});


appSqlLite.post("/api/user/", (req, res, next) => {
    var errors = []
    // if (!req.body.password){
    //     errors.push("No password specified");
    // }
    if (!req.body.email) {
        errors.push("No email specified");
    }
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }

    console.log(req.body)
    var data = {
        numero: req.body.numero,
        email: req.body.email,
        fileUpload: req.body.fileUpload,
        fileConvert: req.body.fileConvert,
        date: req.body.date

    }
    var sql = 'INSERT INTO user (numero,email, fileUpload, fileConvert, date) VALUES (?,?,?,?,?)'
    var params = [data.numero,data.email, data.fileUpload, data.fileConvert, data.date]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message })
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });
})



appSqlLite.patch("/api/user/:id", (req, res, next) => {
    var data = {
        email: req.body.numero,
        email: req.body.email,
        fileUpload: req.body.fileUpload,
        fileConvert: req.body.fileConvert,
        date: req.body.date
    }
    db.run(
        `UPDATE user set 
           numero = COALESCE(?,numero), 
           email = COALESCE(?,email), 
           fileUpload = coalesce(?,fileUpload), 
           fileConvert = coalesce(?,fileConvert), 
           date = coalesce(?,date), 
          
           WHERE id = ?`,
        [data.numero,data.email, data.fileUpload, data.fileConvert, data.date, req.params.id],
        (err, result) => {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({
                message: "success",
                data: data
            })
        });
})

 


// Root path
appSqlLite.get("/", (req, res, next) => {
    res.json({ "message": "Ok" })
});

//____________________________________________________________________________________________________________

// Z-API

const axios = require('axios');

const instanceAPI = 'https://api.z-api.io/instances/382F3021A69E20825A770242AC110002/token/7282B50833ABC938B7E2EADB/send-messages'


const basepath = 'https://carnaval-conectado.herokuapp.com/download/'

const firehost = 'https://firebasestorage.googleapis.com/v0/b/gs1-carnaval-robo.appspot.com/o/'

appSqlLite.post('/send-message/:url/:phone', (req, res) => {
    let phone = req.params.phone
    let link = basepath + encodeURIComponent((req.params.url).replace(firehost, ''))
    console.log('link', link)
    let message = 'Segue aqui o link do vídeo: \n' + link
    console.log('zapi request', phone, message)
    axios.post(instanceAPI, {
        phone,
        message
    })
    .then(function (response) {
        // handle success
        console.log('success');
        res.status(200)
    })
    .catch(function (error) {
        // handle error
        console.log('error');
        res.status(400)
    })
    .then(function () {
        // always executed
        res.end()
    });
})
