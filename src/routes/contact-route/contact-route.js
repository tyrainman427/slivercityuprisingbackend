const express = require('express');
const nodemailer = require('nodemailer');
const contactUsRouter = express.Router();

const transport = {
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.CONTACT_USER,
    pass: process.env.CONTACT_PASS
  }
}

const transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take contact messages");
  }
})

contactUsRouter
  .route('/')
  .post((req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const message = req.body.message
    
    const mailOpts = {
      from: 'Sender Info Placeholder',
      to: process.env.TEST_EMAIL || 'info@silvercityuprising.org',
      subject: 'New Message from Contact Form',
      text: `${name} (${email}) says: ${message}`
    }

    transporter.sendMail(mailOpts, (err, info) => {
      if (err) {
        res.send({
          status: 'fail'
        })
      } else {
        res.send({
          status: 'success'
        })
      }
    })
  })

module.exports = contactUsRouter;