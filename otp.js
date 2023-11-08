let otpGenerator = require("otp-generator");
let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })
// console.log(otp)

let mailer = require("nodemailer");

async function mail(mailOptions) {
      return new Promise((res, rej) => {
            let transporter = mailer.createTransport({
                  host: "smtp.gmail.com",
                  port: 465,
                  secure: true,
                  auth: {
                        user: "your email id put here",
                        pass: "your password put here"
                  }
            })
            transporter.sendMail(mailOptions, (err) => {
                  if (err) {
                        console.log("not send")
                  }
                  return res(`mail is send to ${mailOptions}`)
            })
      })
}

let mailOption = {
      from: "your email id",
      to: "another person email id",
      subject: "mail testing",
      text: `Hello World! + ${otp}`
}

let sendmail = mail(mailOption).catch((error) => {
      return { error }
})
if (!sendmail || (sendmail && sendmail.error)) {
      return { error: "Mail is not send" }
}
return console.log({ data: `mail is send to user ${otp} ` })