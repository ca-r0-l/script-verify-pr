require('dotenv').config()

const nodemailer = require('nodemailer');
const axios = require('axios').default;

const mailOptionsTikusAdmin = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: 'Tem PR novo do Tikus Admin',
    text: ''
};

const mailOptionsTikus = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: 'Tem PR novo do Tikus',
    text: ''
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.PASSWORD_FROM
    }
});

let lastStatusTikus = false;
let lastStatusTikusAdmin = false;

setInterval(() => {
    console.log("Buscando pr's novos no Tikus...\n");

    axios.get(process.env.URL_TIKUS, {
        auth: { user: process.env.GITHUB_USER, password: process.env.GITHUB_TOKEN }
    })
        .then(function (response) {
            const statusNow = response.data.length > 0;

            if (lastStatusTikus !== statusNow && (!lastStatusTikus && statusNow)) {
                transporter.sendMail(mailOptionsTikusAdmin, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Novo PR! Email enviado");
                    }
                });
            }

            lastStatusTikus = response.data.length > 0;
        })
        .catch(function (error) {
            console.log(error);
        });

}, 5000);


setInterval(() => {
    console.log("Buscando pr's novos no Tikus Admin...\n");

    axios.get(process.env.URL_TIKUS_WEB, {
        auth: { user: process.env.GITHUB_USER, password: process.env.GITHUB_TOKEN }
    })
        .then(function (response) {
            lastStatusTikusAdmin = response.data.length > 0;
            const statusNow = response.data.length > 0;

            if (lastStatusTikusAdmin !== statusNow && (!lastStatusTikusAdmin && statusNow)) {
                transporter.sendMail(mailOptionsTikusAdmin, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("Novo PR! Email enviado");
                    }
                });
            }
        })
        .catch(function (error) {
            console.log(error);
        });

}, 5000);
