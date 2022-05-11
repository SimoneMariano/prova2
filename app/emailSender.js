/* The correct OAuth2 scope for Gmail SMTP is https://mail.google.com/, make sure your client has this scope set when requesting permissions for an user
   Make sure that Gmail API access is enabled for your Client ID. To do this, search for the Gmail API in Google API Manager and click on “enable”
   This is the link: https://console.developers.google.com/ */

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  });
  
  let info = await transporter.sendMail({
    from: "lorenzogizzi01@gmail.com", /* "provvisorio": inserire indirizzo con cui mandare la mail */
    to: loggedUser.email,
    subject: "SIGNUP CONFIRMED",
    text: "I hope this message gets through!",
    /*  
        Attachments   
    
    attachments: [
        {   // utf-8 string as an attachment
            filename: 'text1.txt',
            content: 'hello world!'
        },
        {   // binary buffer as an attachment
            filename: 'text2.txt',
            content: new Buffer('hello world!','utf-8')
        },
        {   // file on disk as an attachment
            filename: 'text3.txt',
            path: '/path/to/file.txt' // stream this file
        },
        {   // filename and content type is derived from path
            path: '/path/to/file.txt'
        },
        {   // stream as an attachment
            filename: 'text4.txt',
            content: fs.createReadStream('file.txt')
        },
        {   // define custom content type for the attachment
            filename: 'text.bin',
            content: 'hello world!',
            contentType: 'text/plain'
        },
        {   // use URL as an attachment
            filename: 'license.txt',
            path: 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE'
        },
        {   // encoded string as an attachment
            filename: 'text1.txt',
            content: 'aGVsbG8gd29ybGQh',
            encoding: 'base64'
        },
        {   // data uri as an attachment
            path: 'data:text/plain;base64,aGVsbG8gd29ybGQ='
        },
        {
            // use pregenerated MIME node
            raw: 'Content-Type: text/plain\r\n' +
                 'Content-Disposition: attachment;\r\n' +
                 '\r\n' +
                 'Hello world!'
        }
    ]

        Calendar events:

    icalEvent: {
        method: 'PUBLISH',
        path: '/path/to/file'
    }

    icalEvent: {
        method: 'CANCEL',
        href: 'http://www.example.com/events?event=123'
    }
    
    */
    auth: {
      user: loggedUser.email,
      refreshToken: req.session.googleRefreshToken,
      accessToken: req.session.googleAccessToken,
      expires: 1484314697598,
    },

});