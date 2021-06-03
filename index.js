const express = require("express");
const nodemailer = require("nodemailer");
var bodyParser = require("body-parser");
const cors = require("cors");
const https = require("https");
var fs = require("fs");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(jsonParser);
app.use(urlencodedParser);
app.use(cors());
app.post("/contact", ({ body }, res) => {
  const { name, email, message } = body;
  var transporter = nodemailer.createTransport({
    host: "mail.hosting.de",
    port: process.env.SMTP,
    secure: +process.env.SMTP === 465, // true for 465, false for other ports
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.PWD_EMAIL,
    },
  });
  console.log(transporter);
  var mailOptions = {
    from: { name: "Odysseus Info", address: process.env.FROM_EMAIL },
    to: process.env.TO_EMAIL,
    replyTo: email,
    subject: `Contact from ${name}`,
    html: `<p><b>Contact name :</b> ${name}</p><p><b>Contact email :</b> ${email}</p><p><b>Message :</b></p><p>${message}</p>`,
  };
  console.log("send message");
  transporter.sendMail(mailOptions, function (error, info) {
    console.log(error, info);
    if (error) {
      res.status(500).send();
    } else {
      var response = {
        status: 200,
        success: "Updated Successfully",
      };

      res.end(JSON.stringify(response));
    }
  });
});

if (process.env.DEV) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
} else {
  console.log("configuring https");
  var option = {
    key: fs.readFileSync(
      "/etc/letsencrypt/live/api.odysseus.space/privkey.pem",
      "utf8"
    ),
    cert: fs.readFileSync(
      "/etc/letsencrypt/live/api.odysseus.space/cert.pem",
      "utf8"
    ),
    ca: fs.readFileSync(
      "/etc/letsencrypt/live/api.odysseus.space/chain.pem",
      "utf8"
    ),
  };
  https.createServer(option, app).listen(443, () => {
    console.log("running on port 443");
  });
}
