const nodemailer = require('nodemailer')
const EMAIL = require('../config/email')

exports.sendEmail = async (req, res, next) => {
    const { name, email, message } = req.body
    
    contentHTML = `
        <h1>Confirmación de Email</h1>
        <ul>
            <li>Usuario: ${name}</li>
            <li>Email: ${email}</li>
        </ul>
        <p>${message}</p>
        `

    // console.log(contentHTML)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL.EMAIL,
            pass: EMAIL.PASS
        }
    })

    const mailOptions = {
        from: "Proagro contacto <info@proagrolab.com.ar>", 
        to: email,
        subject: 'Confirmación de Email',
        html: contentHTML
    }
      
    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log('Error'. error.message)
            res.json({Error: error.message})
        } else {
            console.log('Email sent', info.response)
            res.send({ Email: info.response})
        }
    })

    
} 