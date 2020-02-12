$(document).ready(function () {

  // KEeyboard
  let Keyboard = window.SimpleKeyboard.default;
  let actualEmail;
  let actualnameFileUpload;
  var numero;
  var currentNumero
  var fullnumber
  var current_user_data

  // let myKeyboard = new Keyboard({
  //   onChange: input => onChange(input),
  //   onKeyPress: button => onKeyPress(button)
  // });


  function mask($el) {
    setTimeout(function() {
      var v = mphone($el.val());
      if (v != $el.val()) {
        $el.val(v);
      }
    }, 1);
  }
  
  function mphone(v) {
    var r = v.replace(/\D/g, "");
    r = r.replace(/^0/, "");
    if (r.length > 10) {
      r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (r.length > 5) {
      r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (r.length > 2) {
      r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
    } else {
      r = r.replace(/^(\d*)/, "($1");
    }
    return r;
  }
  
  var telefone = []

  $('.number').on('click', function () {
    if (telefone.length >= 11) return
    let number = parseInt($(this).text())
    telefone.push(number)
    fullnumber = telefone.join('')
    $('#telefone').val(fullnumber)
    mask($('#telefone'));
  })

  $('.clear').on('click', function () {
    telefone = []
    $('#telefone').val('')
  })

  $('.backspace').on('click', function () {
    telefone.pop()
    if (telefone.length == 0) {
      $('#telefone').val('')
    } else {
      let fullnumber = telefone.join('')
      $('#telefone').val(fullnumber)
      mask($('#telefone'));
    }
  })

  function onChange(input) {
    document.querySelector(".mail-input").value = input;
    console.log("Input changed", input);
  }

  function onKeyPress(button) {
    console.log("Button pressed", button);
  }

  // INTERFACE
  var currentStep = 1

  $('.next').click(function () {
    let step = $(this).data('step')
    currentNumero = '55' + fullnumber
    console.log('currentNumero', currentNumero)
    nextStep(step)
    /*
    VALIDADE EMAIL

    if (ValidateEmail($('.mail-input').val())) {
      // console.log( $('.mail-input').val())
      actualEmail = $('.mail-input').val()
    }
    */

  })

  $('.back').click(voltar)
  $('.back').fadeOut();

  initCam();

  // PRÓXIMA TELA
  function nextStep(step) {
  
    currentStep = step
   console.log(currentStep)
    $('#step' + (step - 1)).fadeOut(() => {
     
      $('#step' + step).fadeIn()
      if (step === 2) {
        $('.video-output').fadeIn(function () {
          // initCam();
        });

      }
    })
    // se o step atual for o terceiro, começar o counter
    if (step === 3) {
      startCounter()
    }
   
    if (step === 8) {
      $('.back').fadeIn();
    }else{
      $('.back').fadeOut();
    }

  }

  // INCIAR COUNTER PARA GRAVAÇÃO
  function startCounter() {
    $('#c').text('3')
    setTimeout(() => {
      $('#c').text('2')
    }, 1000)
    setTimeout(() => {
      $('#c').text('1')
    }, 2000)
    // END COUNTER
    setTimeout(() => {

      onEndCounter()
    }, 3000)
  }


  // NÃO GOSTEI
  $('.button.repeat').click(function () {
    // nextStep(2)
    currentStep = 2
    $('#step6').fadeOut(() => {
      $('#step' + currentStep).fadeIn()
      $('.video-output').fadeIn()
    })
  })

  // GOSTEI
  $('.button.like').click(function () {
    nextStep(7)
    sendVideo(request_url, currentNumero ,actualnameFileUpload);

    $.ajax({
      url: 'http://localhost:8000/api/user/',
      dataType: 'text',
      type: 'post',
      contentType: 'application/x-www-form-urlencoded',
      data: current_user_data,
      success: function (data, textStatus, jQxhr) {
        console.log('success Sqllite save data!! ' , data);
        current_user_data = '';
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.log('erro', errorThrown);
      }
    });
 
  })

  // fim do counter
  function onEndCounter() {
    nextStep(4)
    // TESTE PARA FINGIR QUE GRAVA POR 2 SEGUNDOS
    setTimeout(() => {
      onRecordingEnded()
    }, 16000 )  // 14000
    startRecord();
  }

  function onRecordingEnded() {
    $('.video-output').fadeOut(function () {
      nextStep(5);
      recorder.stopRecording(postFiles);

    })
  }


  // VOLTAR AO INICIO
  function voltar() {
    $('.mail-input').val('')
    $('.back').fadeOut();
    // Se o stream de video estiver aparecendo, esconder ele
    if (currentStep > 1 && currentStep < 6) {
      $('.video-output').fadeOut()
     
    }
    $('#step' + currentStep).fadeOut(function () {
      $('#step1').fadeIn()
    })
  }

  function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return (true)
    }
    alert("Email invalido!")
    return (false)
  }

  //___________________RECORD VIDEO______________________________________________________________________

  let videoElement = document.querySelector('video');
  const recordedVideo = document.querySelector('video#recorded');
  let request = new XMLHttpRequest();
  let recorder;

  let recordedBlobs;
 

  var mediaStream = null;
  // reusable getUserMedia
  function captureUserMedia(success_callback) {
    var session = {
      video: {
        mandatory: {
          // chromeMediaSource: 'screen',
          // minWidth: 1280,
          // minHeight: 720,

          maxWidth: 1920,
          maxHeight: 1080,

          // minFrameRate: 3,
          // maxFrameRate: 32,

          minAspectRatio: 1.77
        },
        optional: []
      }
    };

    navigator.getUserMedia(session, success_callback, function (error) {
      alert('Unable to capture your camera. Please check console logs.');
      console.error(error);
    });
  }

  function initCam() {

    captureUserMedia(function (stream) {
      mediaStream = stream;

      // videoElement.src = window.URL.createObjectURL(stream);
      videoElement.srcObject = stream;
      videoElement.play();
      videoElement.muted = true;
      videoElement.controls = false;

    });

  }

  function startRecord() {

    recordedVideo.src = null;
    recordedVideo.srcObject = null;

    recorder = RecordRTC(mediaStream, {
      recorderType: MediaStreamRecorder,
      mimeType: 'video/mp4',
      // width: {exact: 1980},

    });

    recorder.startRecording();
    
    //  let idRandom = getRandomArbitrary(1,3);
     let idRandom = 3;
     console.log('btn-position-move_'+idRandom.toString())
     sendPostControl('btn-position-move_'+idRandom.toString());
  
    recorder.onStateChanged = function (state) {
      console.log('Recorder state: ', state);

      if (state == 'stopped') {
   
      }

    };

  }

  function initRecorded(fileName){

    // recordedVideo.src = null;
    // recordedVideo.srcObject = null;
    // recordedVideo.src = window.URL.createObjectURL(recordedBlobs);
    // recordedVideo.controls = true;
    // recordedVideo.play();

    recordedVideo.src = 'http://localhost:3004/uploads/convert/' + fileName;
    recordedVideo.muted = false;
    recordedVideo.controls = false;
    recordedVideo.play();
  }

 //___________________POST CONTROL MOVE ROBOT______________________________________________________________________
  
 function sendPostControl(type) {
        
    request.open('POST', 'control_robot');
    request.send(type);
}

  //___________________POST VIDEO FILE______________________________________________________________________

  var request_url;

  function sendVideo (url, _numero, _nameFileUpload) {
    var storageRef = storage.ref(`videos/${_nameFileUpload}`);
    var url;
    storageRef.put(currentBlob).then(function(snapshot) {
      snapshot.ref.getDownloadURL().then(function (url) {
        console.log('uploaded file!!!', _nameFileUpload)
        request_url = url
        let message = encodeURIComponent(url)
        // let numero = _numero || '5511998684578' ||  '5511982049111' || '5521990481715' 
        let numero = _numero;
        $.ajax({
          url: `http://localhost:8000/send-message/${message}/${numero}`,
          dataType: 'text',
          type: 'post',
          contentType: 'application/x-www-form-urlencoded',
          success: function (data, textStatus, jQxhr) {
            console.log('zapi success');
           
            nextStep(8)
        
          
          },
          error: function (jqXhr, textStatus, errorThrown) {
            console.log('zapi erro', errorThrown);
            currentStep = 6
            $('#step7').fadeOut(() => {
              $('#step6').fadeIn()
            })
          }
        });
      })
    });
  }

  var firebaseConfig = {
    apiKey: "AIzaSyBSZ_61NAVl6FtuxF2tD85PBAOuJkWO6uI",
    authDomain: "gs1-carnaval-robo.firebaseapp.com",
    databaseURL: "https://gs1-carnaval-robo.firebaseio.com",
    projectId: "gs1-carnaval-robo",
    storageBucket: "gs1-carnaval-robo.appspot.com",
    messagingSenderId: "957771317452",
    appId: "1:957771317452:web:15f2aad510ee77a5300269",
    measurementId: "G-2D0GPF8G7M"
  };
  var app = firebase.initializeApp(firebaseConfig);
  
  // Get a reference to the storage service, which is used to create references in your storage bucket
  var storage = app.storage();

  var currentBlob


  function postFiles() {
    recordedBlobs= '';
    recordedBlobs= recorder.getBlob();
 
    // getting unique identifier for the file name
    // var fileName = generateRandomString() + '.mp4';
    // var fileName = actualEmail + '.mp4';
    var fileName = currentNumero + '.mp4';

    console.log("datetime", fileName)

    var file = new File([recordedBlobs], fileName, {
      type: 'video/webm'
    });

    // videoElement.src = '';
    // videoElement.poster = '/ajax-loader.gif';

    xhr('/uploadFile', file, function (responseText) {

      current_user_data='';

      console.log('responseText >>>>>>>>>>>>>> ', responseText)
      var fileURL = JSON.parse(responseText).fileURL;
      var filename = JSON.parse(responseText).fileName;
      var filenameConvert = JSON.parse(responseText).filenameConvert;
      var dateRequest = JSON.parse(responseText).date;
      var emailRequest = JSON.parse(responseText).email || 'dev@venosadesign.com.br';
      var fileBlob = JSON.parse(responseText).fileBlob
      var numero = JSON.parse(responseText).numero

      const byteCharacters = atob(fileBlob);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      currentBlob = new Blob([byteArray], {type: 'video/mp4'});
      // console.log('blobbbbb', blob)

      // actualnameFileUpload = emailRequest.replace(/[^a-z0-9]/gi, '_') + "_" + Math.round(Math.random() * 10000);
      actualnameFileUpload = currentNumero + "_" + Math.round(Math.random() * 10000);
      console.log('actualnameFileUpload ' , actualnameFileUpload)
      // Create a reference to 'mountains.jpg'
      
      nextStep(6);
      initRecorded(filenameConvert);

      // console.log('fileBlob', fileBlob)

      console.info('fileURL', fileURL);
      console.info(' xhr filename', filename, filenameConvert, dateRequest, currentNumero);
      
      // videoElement.src = fileURL;
      // videoElement.play();
      // videoElement.muted = false;
      // videoElement.controls = true;


      //CONVERT_VIDEO________________________________________
      // var request = new XMLHttpRequest();
      // request.open('POST', 'convert');
      // request.send();

   current_user_data = {
        email: emailRequest || 'dev@venosadesign.com.br',
        numero: currentNumero,
        fileUpload: filename,
        fileConvert: filenameConvert,
        date: dateRequest
      }

    
  
      // setTimeout(function(){ 
        // nextStep(6);
        // initRecorded(filenameConvert);
      // }, 10000);
  
    });

  

    // if(mediaStream) mediaStream.stop();
  }

  // XHR2/FormData
  function xhr(url, data, callback) {

    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        callback(request.responseText);
      }
      //    console.log('callback ', request.responseText ,request.readyState ,request.status);

      if (request.responseText) {
        try {
          let respCall = JSON.parse(request.responseText).status;
           console.log(respCall);
          if (respCall == 'fim_video') {
            // click_event = new CustomEvent('click');
            // btnStopRecording.dispatchEvent(click_event);
          }
        }
        catch (err) {

        }

      }

    };

    request.upload.onprogress = function (event) {
      // progressBar.max = event.total;
      // progressBar.value = event.loaded;
      // progressBar.innerHTML = 'Upload Progress ' + Math.round(event.loaded / event.total * 100) + "%";
      console.log('Upload Progress ' + Math.round(event.loaded / event.total * 100) + "%")
    };

    request.upload.onload = function () {
      //percentage.style.display = 'none';
      //progressBar.style.display = 'none';
      // percentage.innerHTML = '100%'
  
    };
    request.open('POST', url);

    var formData = new FormData();
    formData.append('date', getDateTime());
    formData.append('email', actualEmail || 'dev@venosadesign.com.br');
    formData.append('numero', currentNumero);
    formData.append('file', data);
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
      return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
    }
  }

  function getDateTime() {

    var currentdate = new Date();
    var datetime = currentdate.getDate() + "_"
      + (currentdate.getMonth() + 1) + "_"
      + currentdate.getFullYear() + "_"
      + currentdate.getHours() + "_"
      + currentdate.getMinutes() + "_"
      + currentdate.getSeconds();

    return datetime;
  }

  function getRandomArbitrary(min, max) {
    return  Math.floor(Math.random() * (max - min) + min);
}

});