const nodemailer = require('nodemailer')
const properties = require('../config/properties')
const EMAIL = require('../config/email')

exports.sendEmail = async (req, res, next) => {
    const mail = req.body
    // console.log(mail)
    
    if (mail.language == 'es') {
        mailTitu = 'PROAGRO - Notificación de Contacto'
        fromMsg = '"Proagro contacto" <proagro@neocore.com.ar>'
        contentHTML = `
            <div style="display: flex;">
                <img style="height: 57px; width: 95px; margin-right: 10px;" src="cid:logo"/>
                <h1 style="font:24px Helvetica,Arial,sans-serif; font-weight: bold; line-height:1.5;">Proagro contacto - Notificaci&oacute;n de Contacto</h1>
            </div>
            <br>
            <p style="font:14px Helvetica,Arial,sans-serif;">Estimado Proveedor <strong>${mail.nombre}</strong> (Empresa: <strong>${mail.usuario})</strong>.</p>
            <p>En el d&iacute;a de hoy se registr&oacute; la siguiente consulta</p>
            <p><strong>Titulo: </strong>${mail.titulo}</p>
            <p><strong>Mensaje: </strong>${mail.mensaje}</p>
            <p>Nos comunicaremos con ud. para responderle en breve.</p>
            <p>Departamento de Compras - Proagro</p>
            `
    } else {
        mailTitu = 'PROAGRO - Notification of Contact'
        fromMsg = '"Proagro contact" <proagro@neocore.com.ar>'
        contentHTML = `
            <div style="display: flex;">
                <img style="height: 57px; width: 95px; margin-right: 10px;" src="cid:logo"/>
                <h1 style="font:24px Helvetica,Arial,sans-serif; font-weight: bold; line-height:1.5;">Proagro contact - Notification of Contact</h1>
            </div>
            <br>
            <p style="font:14px Helvetica,Arial,sans-serif;">Dear Supplier <strong>${mail.nombre}</strong> (Brand: <strong>${mail.usuario})</strong>.</p>
            <p>Today we have received the below query</p>
            <p><strong>Subject: </strong>${mail.titulo}</p>
            <p><strong>Message: </strong>${mail.mensaje}</p>
            <p>We will revert back to you with a response as soon as possible.</p>
            <p>Purchase Departament - Proagro</p>
            `
    }
    // console.log(contentHTML)

    const transporter = nodemailer.createTransport({
        host: EMAIL.HOST,
        port: EMAIL.PORT,
        secure: EMAIL.SECURE, 
        auth: {
            user: EMAIL.EMAIL,
            pass: EMAIL.PASS
        },
        tls: {
        rejectUnauthorized: false
        }
    })

    const mailOptions = {
        from: '"Proagro contacto" <proagro@neocore.com.ar>', 
        to: mail.email,
        bcc: EMAIL.EMAIL_AUTORIZ,
        bcc: 'it@proagrolab.com.ar',
        subject: mailTitu,
        html: contentHTML,
        attachments: [{
            filename: 'logo.png',
            path: './img/logo.png',
            cid: 'logo' //same cid value as in the html img src
        }]
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