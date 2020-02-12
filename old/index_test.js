var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

    
 // fetching DOM references
 var btnStartCam = document.querySelector('#btn-start-camera');

 var btnStartRecording = document.querySelector('#btn-start-recording');
 var btnStopRecording  = document.querySelector('#btn-stop-recording');

 var btnDefault  = document.querySelector('#btn-default');
 var btnHome  = document.querySelector('#btn-home');
 var btnPositionTest  = document.querySelector('#btn-position-move');
 
 var videoElement      = document.querySelector('video');
 
 var progressBar = document.querySelector('#progress-bar');
 var percentage = document.querySelector('#percentage');
 
 var request = new XMLHttpRequest();
 var recorder;

 // reusable helpers
 
 // this function submits recorded blob to nodejs server
 function postFiles() {
     var blob = recorder.getBlob();

     // getting unique identifier for the file name
     var fileName = generateRandomString() + '.mp4';

     console.log("datetime" , fileName)
     
     var file = new File([blob], fileName, {
         type: 'video/webm'
     });

     videoElement.src = '';
     videoElement.poster = '/ajax-loader.gif';

     xhr('/uploadFile', file, function(responseText) {
         // console.log('responseText >>>>>>>>>>>>>> ' , responseText)
         var fileURL = JSON.parse(responseText).fileURL;
         var filename = JSON.parse(responseText).fileName;
         var filenameConvert = JSON.parse(responseText).filenameConvert;
         var dateRequest =  JSON.parse(responseText).date;
         var emailRequest =  JSON.parse(responseText).email;


         // console.info('fileURL', fileURL);
         console.info(' xhr filename', filename ,filenameConvert, dateRequest );
         videoElement.src = fileURL;
         videoElement.play();
         videoElement.muted = false;
         videoElement.controls = true;

         document.querySelector('#linkActualVideo').innerHTML = '<a href="' + videoElement.src + '">' + videoElement.src + '</a>';
         
         //CONVERT_VIDEO________________________________________
         // var request = new XMLHttpRequest();
         request.open('POST', 'convert');
         request.send();

         const user_data = {
             email : emailRequest,
             fileUpload :filename,
             fileConvert :filenameConvert,
             date :dateRequest

         }

             $.ajax({
                     url: 'http://localhost:8000/api/user/',
                     dataType: 'text',
                     type: 'post',
                     contentType: 'application/x-www-form-urlencoded',
                     data: user_data,
                     success: function( data, textStatus, jQxhr ){
                         console.log( data );
                     },
                     error: function( jqXhr, textStatus, errorThrown ){
                         console.log('erro', errorThrown );
             }
}); 
     
     });
     
     // if(mediaStream) mediaStream.stop();
 }
 
 // XHR2/FormData
 function xhr(url, data, callback) {
    
     request.onreadystatechange = function() {
         if (request.readyState == 4 && request.status == 200) {
             callback(request.responseText);
   
         }
         console.log('callback ' , request.responseText)
     };
             
     request.upload.onprogress = function(event) {
         progressBar.max = event.total;
         progressBar.value = event.loaded;
         progressBar.innerHTML = 'Upload Progress ' + Math.round(event.loaded / event.total * 100) + "%";
         console.log('Upload Progress ' + Math.round(event.loaded / event.total * 100) + "%")
     };
             
     request.upload.onload = function() {
         //percentage.style.display = 'none';
         //progressBar.style.display = 'none';
         percentage.innerHTML  = '100%'
     };
     request.open('POST', url);

     var formData = new FormData();
     formData.append('date', getDateTime());
     formData.append('email',  $( "#inputEmailTxt" ).val() );
     formData.append('file', data );
     request.send(formData);

    
 }

 // generating random string
 function generateRandomString() {
     if (window.crypto) {
         var a = window.crypto.getRandomValues(new Uint32Array(3)),
             token = '';
         for (var i = 0, l = a.length; i < l; i++) token += a[i].toString(36);
         return token;
     } else {
           return (Math.random() * new Date().getTime()).toString(36).replace( /\./g , '');    
     }
 }

  function getDateTime(){
        
    var currentdate = new Date(); 
     var datetime = currentdate.getDate() + "_"
     + (currentdate.getMonth()+1)  + "_" 
     + currentdate.getFullYear() + "_"  
     + currentdate.getHours() + "_"  
     + currentdate.getMinutes() + "_" 
     + currentdate.getSeconds();

     return datetime;
}

 var mediaStream = null;
 // reusable getUserMedia
 function captureUserMedia(success_callback) {
     var session = {
         audio: true,
         video: true
     };
     
     navigator.getUserMedia(session, success_callback, function(error) {
         alert('Unable to capture your camera. Please check console logs.');
         console.error(error);
     });
 }

 // UI events handling
 btnStartRecording.onclick = function() {
     btnStartRecording.disabled = true;
     
     captureUserMedia(function(stream) {
         mediaStream = stream;
         
         // videoElement.src = window.URL.createObjectURL(stream);
         videoElement.srcObject=stream;
         videoElement.play();
         videoElement.muted = true;
         videoElement.controls = false;
         
         recorder = RecordRTC(stream, {
             recorderType: MediaStreamRecorder,
             mimeType: 'video/mp4'
         });
         
         recorder.startRecording();
         
         // enable stop-recording button
         btnStopRecording.disabled = false;
     });

     // var request = new XMLHttpRequest();
         request.open('POST', 'position_robot');
       //  request.send();
 };


 btnStopRecording.onclick = function() {
     btnStartRecording.disabled = false;
     btnStopRecording.disabled = true;
     
     recorder.stopRecording(postFiles);

     // var request = new XMLHttpRequest();
         request.open('POST', 'home_robot');
        // request.send();
 };

 btnStartCam.onclick = function() {


 }

 btnHome.onclick = function() {
     // var request = new XMLHttpRequest();
         request.open('POST', 'home_robot');
         request.send();

 }

 btnPositionTest.onclick = function() {
     // var request = new XMLHttpRequest();
         request.open('POST', 'position_robot');
         request.send();

 }

 btnDefault.onclick = function() {
     // var request = new XMLHttpRequest();
         request.open('POST', 'default_robot');
         request.send();

 }

 window.onbeforeunload = function() {
     startRecording.disabled = false;
 };


 
 