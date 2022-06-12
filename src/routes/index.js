const { Router } = require('express');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const router = Router();

router.post('/send-email' , (req, res) => {
    
    console.log(req.body);
    const { name, email , message} = req.body;
    let contentHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>test email</title>
        <style>
            body{
                font-family: Arial, Helvetica, sans-serif;
            }
            .prof{
                font-weight: 550;
            }
        </style>
    </head>
    <body>
        <div>
            <p>¡Hola <span>${name}</span> gracias por tu mensaje! <span style='font-size:17px;'>&#128588;</span></p> 
            <p>Recibiras mi respuesta pronto!</p>
            <p>¡Saludos! <span style='font-size:17px;'>&#128640;</span></p>
            <p class="prof">Mauricio Fernandez <br> Software Developer</p>
        </div>
    </body>
    </html>
    `;

    let contentHTMLToMyEmail = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>email</title>
        <style>
            body{
                background-color: #E4E9F7;
            }
            h1,
            h2,
            h3 {
                text-align: left;
                font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
    
            h2 {
                font-size: 1.2em;
            }   
    
            h3{
                font-size: 1em;
                margin: 0;
                color: #aaa;
            }
    
            h1 span{
                color: #695CFE;
            }
            p {
                font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            .email-container{
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh
            }
            .email-content{
                background-color: #fff;
                border-radius: 5px;
                padding: 1em;
                max-width: 500px;
            }
          </style>
    </head>
    <body>
        <section class="email-container">
            <div class="email-content">
                <h1 class="email-title">Mensaje nuevo de sitio web perosnal</h1>
                <ul>
                    <li>sender: ${name} </li>
                    <li>email: ${email} </li>
                    <li>message: ${message} </li>
                </ul>
            </div>
        </section>
    </body>
    </html>
    `;

    const CLIENT_ID = "644455366502-tlf4nn0scmv2edj0n7lnuil2ko9egu79.apps.googleusercontent.com";
    const CLIENT_SECRET = "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";
    const CLIENT_REDIRECT_URI = "https://developers.google.com/oauthplayground";
    const REFRESH_TOKEN = "1//04XjxNUaOgv5aCgYIARAAGAQSNwF-L9Ir5PMDowZoKnIAzOGKziUGCwzx88jJc0M-iFN8XPkqIdIgAMoUl0bli3jLihkccdFIfY4";
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,CLIENT_REDIRECT_URI);
    oAuth2Client.setCredentials({
        refresh_token : REFRESH_TOKEN
        
    });

    async function sendEmail(email, contentHTML)
    {   
        try{
            const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
            const transporter = nodemailer.createTransport({
                service:"gmail",
                auth:{
                    type: "OAuth2",
                    user: "maufernandezdev@gmail.com",
                    clientId: CLIENT_ID,
                    clientSecret : CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: ACCESS_TOKEN
                }
            });
            const mailOptions = {
                from: "Mauricio Fernandez Developer <maufernadezdev>",
                to: email,
                subject:"Mauricio Fernandez sitio web 🤓",
                html: contentHTML
            };

            const result = await transporter.sendMail(mailOptions);
            return result;
        }
        catch(err){
            console.log("error send email: " + err);
        }
    }
    

    /* [MRF 2022-05-01] send response to user */
    sendEmail(email, contentHTML)
        // .then((result) => res.status(200).send('received'))
        .then((result) => res.redirect('success.html'))
        .catch((error) => console.log("error: " + error.message));

    /* [MRF 2022-05-01] send user data to my personal email */
    sendEmail("fernandeznm24@gmail.com", contentHTMLToMyEmail);    
});


module.exports = router;