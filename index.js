const express = require("express");
const nodemailer = require("nodemailer");
var bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(jsonParser);
app.use(urlencodedParser);

app.post("/contact", ({ body }, res) => {
  const { name, email, message } = body;
  console.log("receiving contact");
  var transporter = nodemailer.createTransport({
    host: "mail.hosting.de",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.USER,
      pass: process.env.PWD,
    },
  });

  var mailOptions = {
    from: process.env.FROM_EMAIL,
    to: process.env.TO_EMAIL,
    subject: `Contact from ${name}`,
    html: `<p><b>Contact name :</b> ${name}</p><p><b>Contact email :</b> ${email}</p><p><b>Message :</b></p><p>${name}</p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(500);
    } else {
      res.status(200);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
