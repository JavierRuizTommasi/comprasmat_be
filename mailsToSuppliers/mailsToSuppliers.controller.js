const MailsToSuppliers = require('./mailsToSuppliers.dao')
const Tenders = require('../tenders/tenders.dao')
const myProducts = require('../myproducts/myproducts.dao')
const User = require('../users/user.dao')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const SECRET_KEY = require('../auth.config')

const nodemailer = require('nodemailer')
const properties = require('../config/properties')
const EMAIL = require('../config/email')
const { resolveContent } = require('nodemailer/lib/shared')

var moment = require('moment')

exports.createMailsToSupplier = (req, res, next) => {
    const newMail = req.body

    MailsToSuppliers.create(newMail, (err, mail) => {
        if (err && err.code === 11000) return res.send({ message: 'Mail already exists' })
        if (err) res.json({errr: err})
        res.json({ message: 'Mail created successfully'})
    })
} 

exports.createMailsToSuppliers = (req, res, next) => {
    const newMailsToSuppliers = req.body

    newMailsToSuppliers.forEach(element => {
        // console.log(element)

        MailsToSuppliers.create(element, (err, mail) => {
            if (err && err.code === 11000) return res.send({ message: 'Mails already exists' })
            if (err) res.json({errr: err})
        })
        
    })
    res.json({ message: 'Mails created successfully'})
} 

// exports.redirTender = (req, res, next) => {
//     const token = req.params.token
//     const tender = req.params.tender + '/' + req.params.prod

//     console.log(req.params)

//     if (token) {
//       jwt.verify(token, SECRET_KEY, (err, decoded) => {      
//           if (err) {
//               console.log('Token inválida')
//               res.send({mensaje: 'Token inválida'})

//           } else {
//               const { id } = decoded;    
//               // console.log(decoded)
//               console.log('Token OK.', decoded)
//             //   console.log('id', id)

//               User.findOne({ _id: id }, (err, user) => {
//                 if (err) return res.send({ message: 'Server error!' });
          
//                 // console.log(user)
//                 if (!user) {
//                   // id does not exist
//                   res.send({ message: 'User not found' });
//                 } else {
//                     const dataUser = {
//                         id: user.id,
//                         usuario: user.usuario,
//                         nombre: user.nombre,
//                         email: user.email,
//                         perfil: user.perfil,
//                         language: user.language,
//                         activo: user.activo,
//                         proveedor: user.proveedor,
//                         accessToken: token,
//                         expiresIn: 3600
//                     }

//                     console.log(dataUser)
//                     res.send({ dataUser });

//                     const logUrl = properties.URLHOME + '/offers/' + tender  + '/' + token      
//                     console.log(logUrl)

//                     res.redirect(logUrl)        
//                 }
//               })
//           }
//       });
//     } else {
//         console.log('Token no provista')
//         // res.redirect('/')
//         res.send({mensaje: 'Token no provista'})
//     }
// }

exports.sendMailsToSuppliers = async (req, result) => {
    const emailToSend = req.body.email
    console.log(emailToSend)

    const logFecha = moment(new Date()).format('YYYY-MM-DD, h:mm:ss a')
    // console.log('Fecha', logFecha)

    const myTenders = (query) => {
        return new Promise ((resolve, reject) => {
        console.log(query)
        Tenders.get(query, (err, myTenders) => {
            if (err) reject({ error: err})
            resolve(myTenders)
        })      
    })}

    const myProds = (query) => {
        return new Promise ((resolve, reject) => {
        // console.log(query)
        myProducts.get(query, (err, myProds) => {
            if (err) reject({ error: err})
            resolve(myProds)
        })      
    })}

    const myUsers = (query) => {
        return new Promise ((resolve, reject) => {
        // console.log(query)
        User.get(query, (err, myUsers) => {
            if (err) reject({ error: err})
            resolve(myUsers)
        })      
    })}

    const saveMail = (query) => {
        return new Promise ((resolve, reject) => {
        // console.log(query)
        MailsToSuppliers.create(query, (err, mail) => {
            if (err) reject({ error: err})
            resolve(mail)
        })
    })}

    const mandaMail = (mail) => {
        return new Promise ((resolve, reject) => {
            // console.log(mail)

            const expiresIn = '1d' 
            const accessToken = jwt.sign({ id: mail.userId }, SECRET_KEY, { expiresIn: expiresIn })

            // console.log(accessToken)
            // console.log('EmailToSend', emailToSend)

            switch (emailToSend) {
                case 'send1st': 
                    if (mail.language == 'es') {
                        contentHTML = `
                        <div style="display: flex;">
                            <img style="height: 57px; width: 95px; margin-right: 10px;" src="cid:logo"/>
                            <h1 style="font:24px Helvetica,Arial,sans-serif; font-weight: bold; line-height:1.5;">Notificaci&oacuten de Nueva Solicitud de Cotizaci&oacuten</h1>
                        </div>
                        <br>
                        <p style="font:14px Helvetica,Arial,sans-serif;">Estimado Proveedor <strong>${mail.provenom}</strong> (Empresa: <strong>${mail.usuario})</strong>.</p>
                        <p>En el d&iacute;a de hoy se gener&oacute; la solicitud de Cotizaci&oacute;n <strong># ${mail.licitacion}</strong> que finalizar&aacute; el pr&oacute;ximo <strong>${moment(mail.finaliza).format("DD/MM/YYYY")}</strong></p>
                        <ul>
                            <li>Insumo: <strong>${mail.descrip}</strong></li>
                            <li>Cantidad: <strong>${mail.cantidad} ${mail.unidad}</strong></li>
                        </ul>
                        <p>Si le interesa acercarnos su oferta para ser tenido en cuenta en el an&aacute;lisis de compra del insumo, por favor haga click 
                            en el siguiente link para acceder a nuestra web y complete su cotizaci&oacute;n antes de la fecha de finalizaci&oacute;n.
                            <br><a href="${properties.URLHOME}/login/offer/${accessToken}/${mail.licitacion}">${properties.URLHOME}/login/offer/${accessToken}/${mail.licitacion}</a>
                        </p>
                        <p>Departamento de Compras - Proagro</p>
                        <p><h5 style="text-align:center">Haga click aqu&iacute; para <a href="${properties.URLAPI}/unsubscribe/${accessToken}">desuscribirse</a></h5></p>
                        `
                    } else {
                        contentHTML = `
                        <div style="display: flex;">
                            <img style="height: 57px; width: 95px; margin-right: 10px;" src="cid:logo"/>
                            <h1 style="font:24px Helvetica,Arial,sans-serif; font-weight: bold; line-height:1.5;">Notification of New Request for Quotation</h1>
                        </div>
                        <br>
                        <p style="font:14px Helvetica,Arial,sans-serif;">Dear supplier <strong>${mail.provenom}</strong> (Brand: <strong>${mail.usuario})</strong>.</p>
                        <p>Today it was generated the Request for quotation <strong># ${mail.licitacion}</strong> that will finalize the next <strong>${moment(mail.finaliza).format("MM/DD/YYYY")}</strong></p>
                        <ul>
                            <li>Supply: <strong>${mail.descrip}</strong></li>
                            <li>Quantity: <strong>${mail.cantidad} ${mail.unidad} </strong></li>
                        </ul>
                        <p>If you are interest to send us your offer in order to be considered during our purchase process, please click on the below link 
                        to be redirected to our web site and complete your quotation. 
                            <br><a href="${properties.URLHOME}/login/offer/${accessToken}/${mail.licitacion}">${properties.URLHOME}/login/offer/${accessToken}/${mail.licitacion}</a>
                        </p>
                        <p>Purchase Departament - Proagro</p>
                        <p><h5 style="text-align:center">Click here to <a href="${properties.URLAPI}/unsubscribe/${accessToken}">unsubcribe</a></h5></p>
                        `
                            // <br><br><a href="proveedores.cf">proveedores.cf</a>
                    }
                    break
                default:    
                    if (mail.language == 'es') {
                        contentHTML = `
                        <div style="display: flex;">
                            <img style="height: 57px; width: 95px; margin-right: 10px;" src="cid:logo"/>
                            <h1 style="font:24px Helvetica,Arial,sans-serif; font-weight: bold; line-height:1.5;">Aviso de Solicitud de Cotizaci&oacute;n por Finalizar</h1>
                        </div>
                        <br>
                        <p style="font:14px Helvetica,Arial,sans-serif;">Estimado Proveedor <strong>${mail.provenom}</strong> (Empresa: <strong>${mail.usuario})</strong>.</p>
                        <p>La solicitud de Cotizaci&oacute;n <strong># ${mail.licitacion}</strong> finalizar&aacute; el pr&oacute;ximo <strong>${moment(mail.finaliza).format("DD/MM/YYYY")}</strong></p>
                        <ul>
                            <li>Insumo: <strong>${mail.descrip}</strong></li>
                            <li>Cantidad: <strong>${mail.cantidad} ${mail.unidad}</strong></li>
                        </ul>
                        <p>Si le interesa acercarnos su oferta para ser tenido en cuenta en el an&aacute;lisis de compra del insumo, por favor haga click en el siguiente link para acceder a nuestra web 
                        y complete su cotizaci&oacute;n antes de la fecha de finalizaci&oacute;n.
                        Si ya realiz&oacute; su oferta, consultela para verificar su ranking.
                            <br><a href="${properties.URLHOME}/login/offer/${accessToken}/${mail.licitacion}">${properties.URLHOME}/login/offer/${accessToken}/${mail.licitacion}</a>
                        </p>
                        <p>Departamento de Compras - Proagro</p>
                        <p><h5 style="text-align:center">Haga click aqu&iacute; para <a href="${properties.URLAPI}/unsubscribe/${accessToken}">desuscribirse</a></h5></p>
                        `
                    } else {
                        contentHTML = `
                        <div style="display: flex;">
                            <img style="height: 57px; width: 95px; margin-right: 10px;" src="cid:logo"/>
                            <h1 style="font:24px Helvetica,Arial,sans-serif; font-weight: bold; line-height:1.5;">Warning of Request for Quotation to Finalize</h1>
                        </div>
                        <br>
                        <p style="font:14px Helvetica,Arial,sans-serif;">Dear supplier <strong>${mail.provenom}</strong> (Brand: <strong>${mail.usuario})</strong>.</p>
                        <p>The Request for quotation <strong># ${mail.licitacion}</strong> will finalize the next <strong>${moment(mail.finaliza).format("MM/DD/YYYY")}</strong></p>
                        <ul>
                            <li>Supply: <strong>${mail.descrip}</strong></li>
                            <li>Quantity: <strong>${mail.cantidad} ${mail.unidad} </strong></li>
                        </ul>
                        <p>If you are interest to send us your offer in order to be considered during our purchase process, please click on the below link 
                        to be redirected to our web site and complete your quotation before the due date.
                        In case you have already made your offer please check it and verify the ranking.
                            <br><a href="${properties.URLHOME}/login/offer/${accessToken}/${mail.licitacion}">${properties.URLHOME}/login/offer/${accessToken}/${mail.licitacion}</a>
                        </p>
                        <p>Purchase Departament - Proagro</p>
                        <p><h5 style="text-align:center">Click here to <a href="${properties.URLAPI}/unsubscribe/${accessToken}">unsubcribe</a></h5></p>
                        `
                    }
                    break
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
        
            // console.log('transporter', transporter)

            switch (emailToSend) {
                case 'send1st': 
                    if (mail.language == 'es') {
                        mailTitu = 'PROAGRO - Notificación de Nueva Solicitud de Cotización ' + mail.licitacion + ' - ' + mail.descrip
                        fromMsg = '"Proagro contacto" <proagro@neocore.com.ar>'
                    } else {
                        mailTitu = 'PROAGRO - Notification of New Request for Quotation ' + mail.licitacion + ' - ' + mail.descrip
                        fromMsg = '"Proagro contact" <proagro@neocore.com.ar>'
                    }
                    break
                default:    
                    if (mail.language == 'es') {
                        mailTitu = 'PROAGRO - Aviso de Solicitud de Cotización por Finalizar ' + mail.licitacion + ' - ' + mail.descrip
                        fromMsg = '"Proagro contacto" <proagro@neocore.com.ar>'
                    } else {
                        mailTitu = 'PROAGRO - Warning of Request for Quotation to Finalize ' + mail.licitacion + ' - ' + mail.descrip 
                        fromMsg = '"Proagro contact" <proagro@neocore.com.ar>'
                    }
                    break
            }
            
            // const mailOptions = {
            //     from: '"Proagro contacto" <proagro@neocore.com.ar>', 
            //     to: mail.email,
            //     bcc: EMAIL.EMAIL_AUTORIZ,
            //     subject: mailTitu,
            //     html: contentHTML
            // }
            
            const mailOptions = {
                from: '"Proagro contacto" <proagro@neocore.com.ar>', 
                to: mail.email,
                bcc: EMAIL.EMAIL_AUTORIZ,
                subject: mailTitu,
                html: contentHTML,
                attachments: [{
                    filename: 'logo.png',
                    path: './img/logo.png',
                    cid: 'logo' //same cid value as in the html img src
                }]
            }

            transporter.sendMail(mailOptions, function(err, info){
                if (err) reject({ error: err})
                resolve(info)
            })
        })
    }

    const updtTender = (query, updt) => {
        return new Promise ((resolve, reject) => {
        // console.log(query)
        Tenders.update(query, updt, (err, res) => {
            if (err) reject({ error: err})
            resolve(res)
        })
    })}

    try {
        let tenderFilter = {}
        switch (emailToSend) {
            case 'send1st': 
                tenderFilter = { estado: 0 }
                console.log('send1s', tenderFilter) 
                break
            case 'send48': 
                fechaSearch = moment(new Date()).add(1, 'days').format('YYYY-MM-DD') + 'T00:00:00Z'
                // console.log('fechaSearch', fechaSearch) 
                // let fechaQuery = { finaliza: new Date(fechaSearch) }
                // console.log('fechaQuery', fechaQuery) 
                tenderFilter = { finaliza: new Date(fechaSearch), send48: false, estado: 1 }
                console.log('send48', tenderFilter) 
                break
            case 'send72': 
                fechaSearch = moment(new Date()).add(2, 'days').format('YYYY-MM-DD') + 'T00:00:00Z'
                // console.log('fechaSearch', fechaSearch) 
                // let fechaQuery = { finaliza: new Date(fechaSearch) }
                // console.log('fechaQuery', fechaQuery) 
                tenderFilter = { finaliza: new Date(fechaSearch), send72: false, estado: 1 }
                console.log('send72', tenderFilter) 
                break
            default:
                break
        }

        let tenders = await myTenders(tenderFilter)
        console.log('Tenders: ',tenders.length)

        if (tenders.length != 0 ) {
            for(var numTender in tenders) {

                let tender = tenders[numTender] 
                if (tender) {

                    let provs = await myProds({ codigo: tender.producto })
                    // console.log(provs)

                    for(var prov in provs) {
                        // console.log(provs[prov])

                        let users = await myUsers({ usuario: provs[prov].usuario, activo: true })
                        // console.log(users)
                                    
                        for(var user in users) {
                            // console.log(users[user].usuario)
                            // console.log(users[user])

                            let mail = {
                                licitacion: tender.licitacion,
                                producto: tender.producto,
                                descrip: tender.descrip,
                                cantidad: tender.cantidad,
                                unidad: tender.unidad,
                                finaliza: tender.finaliza,
                                fecha: logFecha,
                                userId: users[user]._id,
                                usuario: users[user].usuario,
                                proveedor: users[user].proveedor,
                                provenom: users[user].nombre,
                                email: users[user].email,
                                language: users[user].language
                            }

                            strEmail = mail.email
                            if (users[user].email2) {
                                strEmail = strEmail + ';' + users[user].email2
                            }
                            if (users[user].email3) {
                                strEmail = strEmail + ';' + users[user].email3
                            }
                            if (users[user].email4) {
                                strEmail = strEmail + ';' + users[user].email4
                            }

                            console.log(strEmail)
                            mail.email = strEmail

                            // console.log(moment(mail.finaliza).format("DD/MM/YYYY"))

                            let sent = await mandaMail(mail)
                            console.log('Sent')

                            let saved = await saveMail(mail)
                            console.log('Saved')
                        }

                    }

                } else {
                    // result.json({ message: 'No Tender found'})
                    message = logFecha + 'No tender found'
                    console.log(message)
                    // return message
                    result.json(message)
                }

                switch (emailToSend) {
                    case 'send1st': 
                        active = await updtTender({_id: tender._id}, {estado: 1})
                        console.log('Tender Activated')
                        break
                    
                    case 'send48': 
                        active = await updtTender({_id: tender._id}, {send48: true})
                        console.log('Tender Updated')
                        break

                    case 'send72': 
                        active = await updtTender({_id: tender._id}, {send72: true})
                        console.log('Tender Updated')
                        break

                    default:
                        break
                }
            }

            // result.json({ message: 'Mails sent successfully'})
            message = logFecha + 'Mails sent successfully'
            console.log(message)
            result.json(message)
            // return message
        
        } else {
            // result.json({ message: 'No Active Tenders'})
            message = logFecha + ' No Active Tenders'
            console.log(message)
            // let result = {'results': JSON.stringify(message), 'json': ()=>{return message}
            // return message
            result.json(message)
        }

    }
        catch(error) {
            console.log('error')
            result.json({ error: err})
    }
} 

exports.getMailsToSuppliers = (req, res, next) => {
    // console.log('Suppliers')
    MailsToSuppliers.get({}, (err, mails) => {
        if (err) res.json({ error: err})
        // res.json({Users: users})
        res.send({MailsToSuppliers: mails})
    })
}

exports.getmailsToSupplier = (req, res, next) => {
    MailsToSuppliers.findOne({ _id: req.params.id }, (err, mail) => {
        if (err) res.json({ error: err })
        res.json({MailsToSupplier: mail})
    })
}
  
exports.udpateMailsToSupplier = (req, res, next) => {
    const mail = req.body

    MailsToSuppliers.update({ _id: req.params.id }, mail, (err, mail) => {
        if (err) res.json({ error: err})
        res.json({message: 'Mail updated successfully'})        
    })
}

exports.deleteMailsToSupplier = (req, res, next) => {
    MailsToSuppliers.delete({ _id: req.params.id }, (err, mail) => {
        if (err) res.json({ error: err})
        res.json({message: 'Mail deleted successfully'})
    })
}
