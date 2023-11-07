let mailer = require("nodemailer");

function mail(mailoption) {
      return new Promise((res, rej) => {
            let transporter = mailer.createTransport({
                  host: "smtp.gmail.com",
                  port: 465,
                  secure: true,
                  auth: {
                        user: "rahulkumar058790@gmail.com",
                        pass: "lxte pyhj vnai gkqp"
                  }
            })
            transporter.sendMail(mailoption, (err, info) => {
                  if (err) {
                        return rej(err)
                  }
                  return res(`mail is send to ${mailoption.to}`)
            })
      })
}
module.exports = { mail }