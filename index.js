const express = require ('express');
const creds = require ('./config');
const bodyParser = require ('body-parser'); // process the form data
const nodemailer = require ('nodemailer');
const cors = require ('cors'); // allow cross-origin requests

const app = express (); 

const port = 4444; 

app.use (bodyParser.json ());
app.use (bodyParser.urlencoded ({ extended: true })); 
app.use (cors ()); 

app.listen (port, () => {
    console.log (`Server is listening on ${port}`);
});

/* Configure transporter. The Simple Mail Transfer Protocol - SMTP - is a communication protocol for 
electronic mail transmission. */

const transport = {
    host: 'smtp.gmail.com',
    auth: {
        user: creds.USER,
        pass: creds.PASS
    }
};

const transporter = nodemailer.createTransport (transport); 

transporter.verify ( (error, success) => {
    if (error) {
        console.log (error); 
    } else {
        console.log ('Server is ready to take messages');
    }
});

app.get ('/', (req, res) => {
    res.send ('Welcome to API!');
});

/* POST data to the destination email address that is specified. */

app.post ('/send', (req, res, next) => {

    const { name, email, message } = req.body;
    const content = `name: ${name} \n email: ${email} \n message: ${message}`;

    const mail = {
        from: name,
        to: 'kristina.n.savova@gmail.com',
        subject: 'New Message from Contact Form',
        text: content 
    }

    transporter.sendMail (mail, (error, data) => {
        if (error) {
            res.json ({ msg: 'FAIL' });
        } else {
            res.json ({ msg: 'SUCCESS'});
        }
    });
});