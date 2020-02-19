// Z-API

const axios = require('axios');

const instanceAPI = 'https://api.z-api.io/instances/382F3021A69E20825A770242AC110002/token/7282B50833ABC938B7E2EADB/send-messages'


 sendMsg('5511972840280')

function sendMsg(_phone) {
    let phone = _phone
   
    
    let message = 'Obrigado por participar da Selfie 4.0 da GS1 Brasil! Poste seu video e use as #carnavalconectado e #temposmodernos';
    console.log('zapi request', phone, message)
    
    axios.post(instanceAPI, {
        phone,
        message
    })
    .then(function (response) {
        // handle success
        console.log('first success');
        // res.status(200)
        
    })
    .catch(function (error) {
        // handle error
        console.log('error');
        res.status(400)
    })
    .then(function () {
        // always executed
        // res.end()
    });
}