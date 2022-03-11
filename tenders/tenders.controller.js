const Tenders = require('./tenders.dao')
const Products = require('../products/products.dao')
const Offers = require('../offers/offers.dao')
const Suppliers = require('../suppliers/suppliers.dao')
const SettingScorings = require('../settingScorings/settingScorings.dao')

const nodemailer = require('nodemailer')
const properties = require('../config/properties')
const EMAIL = require('../config/email')

var moment = require('moment')

exports.createTenders = (req, res, next) => {
    const newTender = req.body
    
    Tenders.create(newTender, (err, tender) => {
        if (err && err.code === 11000) return res.send({ message: 'Tender already exists' })
        if (err) res.json({errr: err})
        res.json({ message: 'Tender created successfully'})
    })
} 

exports.getTenders = (req, res, next) => {
    // console.log('Tenders')
    Tenders.get({}, (err, tenders) => {
        return new Promise((resolve) => { 
            let messaje = ''
            if (err) {
                message = 'Server error!'
            } else {
                // res.json({Users: users})
                message = {Tenders: tenders}
            }
            resolve(res.send(message))
        })
    })
}

exports.getTender = (req, res, next) => {
    Tenders.findOne({ _id: req.params.id }, (err, tender) => {
        if (err) res.json({ error: err })
        res.json({Tender: tender})
    })
}
  
exports.getTendersActives = (req, res, next) => {
    // console.log('Actives')
    Tenders.get({ estado: 1 }, (err, tenders) => {
        if (err) res.json({ error: err})
        res.json({Tenders: tenders})
    })
}

exports.udpateTenders = (req, res, next) => {
    const tender = req.body
    
    Tenders.updateOne({ _id: req.params.id }, tender, (err, tender) => {
        if (err) res.json({ error: err})
        res.json({message: 'Tender updated successfully'})        
    })
}

exports.deleteTenders = (req, res, next) => {
    Tenders.delete({ _id: req.params.id }, (err, tender) => {
        if (err) res.json({ error: err})
        res.json({message: 'Tender deleted successfully'})
    })
}

exports.sendTenders = (req, res, next) => {
    // console.log(req.params.email)

    if (req) {
        req.forEach(elem => { 
            console.log(elem); 
            if (err) return res.send({ message: 'Server error!' });
            const newEmail = {
                id: req.id,
                usuario: req.usuario,
                nombre: req.nombre,
                email: req.email,
                language: req.language
            }
    
            // console.log(newEmail)
            if (newUser.language == 'es') {
                contentHTML = `
                <h1>PROAGRO - Activación cuenta de Usuario Proveedor</h1>
                <ul>
                    <li>Usuario: <strong>${newEmail.usuario}</strong></li>
                    <li>Nombre: <strong>${newEmail.nombre}</strong></li>
                    <li>Email: <strong>${newEmail.email}</strong></li>
                </ul>
        
                <p>Haga click en el link para activar su cuenta</p>
                <p><a href="${properties.URLAPI}autentication/${accessToken}">${properties.URLAPI}autentication/${accessToken}</a></p>
                <br>
                `
            } else {
                contentHTML = `
                <h1>PROAGRO - User Supplier account activation</h1>
                <ul>
                    <li>User: <strong>${newEmail.usuario}</strong></li>
                    <li>Name: <strong>${newEmail.nombre}</strong></li>
                    <li>Email: <strong>${newEmail.email}</strong></li>
                </ul>
        
                <p>Click on the link to activate your account</p>
                <p><a href="${properties.URLAPI}autentication/${accessToken}">${properties.URLAPI}autentication/${accessToken}</a></p>
                <br>
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
        
            if (newUser.language == 'es') {
                mailTitu = 'PROAGRO - Notificación de Licitación' 
            } else {
                mailTitu = 'PROAGRO - Tender Notification' 
            }
            
            const mailOptions = {
                from: '"Proagro contacto" <proagro@neocore.com.ar>', 
                to: newEmail.email,
                subject: mailTitu,
                html: contentHTML
            }
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log('Error'. error.message)
                    // res.json({ message: error.message })
                } else {
                    console.log('Email sent', info.response)
                    // res.send({ Email: info.response})
                    // response 
                    // res.send({ newEmail });
                    //res.json({ message: 'User created successfully'})
                }
            })
        })
 
        res.json({ message: 'Emails sent'})


    } else {
        console.log('Pruducto no provisto')
        // res.redirect('/')
        res.send({mensaje: 'Producto no provisto'})
    }
}

exports.updateScoring = async (req, res, next) => {

    const recTender = (query) => { 
        return new Promise ((resolve, reject) => {
        Tenders.get(query, (err, tender) => {
            if (err) reject({ error: err})
            // console.log({tender})
            resolve({tender})
        })
    })}

    const recProduct = (query) => {
        return new Promise ((resolve, reject) => {
        // console.log(query)
        Products.get(query, (err, product) => {
            if (err) reject({ error: err})
            // console.log({product})
            // res.json({Tender: tender})
            resolve({product})
        })
    })}

    const recSupplier = (query) => {
        return new Promise ((resolve, reject) => {
        // console.log(query)
        Suppliers.get(query, (err, supplier) => {
            if (err) reject({ error: err})
            // console.log({supplier})
            // res.json({Tender: tender})
            resolve({supplier})
        })
    })}

    const recSettingScorings = (query) => {
        return new Promise ((resolve, reject) => {
        // console.log(query)
        SettingScorings.get(query, (err, settingScorings) => {
            if (err) reject({ error: err})
            // console.log({product})
            // res.json({Tender: tender})
            resolve({settingScorings})
        })
    })}

    const updtOffer = (query, offer) => {
        return new Promise ((resolve, reject) => {
        // console.log(query)
        Offers.updateOne(query, offer, (err, offer) => {
            if (err) reject({ error: err})
            // console.log({product})
            // res.json({Tender: tender})
            resolve({offer})
        })
    })}

    try {
        // console.log('req: ',req.params)

        let tender = await recTender({ _id: req.params.id })
        // console.log('Producto: ',tender.tender[0].producto)
        // Tomo la cantidad de la Licitacion
        const cantiLic = tender.tender[0].cantidad
        // console.log('Cantidad: ',cantiLic)

        // Busco el valor historico del producto
        let product = await recProduct({ codigo: tender.tender[0].producto })
        const precioHisto = product.product[0].historico ? product.product[0].historico : 0 
        // console.log('PrecioHisto', precioHisto)

        // Busco los settings para el Scoring
        let settingScorings = await recSettingScorings({})
        // console.log('settingScorings', settingScorings)

        // Ciclo entre las Ofetas para sacar Menor Entrega y Mayor Financiacion
        const fecha = moment().startOf('day')
        // console.log('Fecha',fecha)
        let menorEntrega = tender.tender[0].offer[0].entrega 
        let mayorFinanciacion = tender.tender[0].offer[0].financiacion
        for(var offer in tender.tender[0].offer) {
            // console.log('Offer',tender.tender[0].offer[offer])
            if (tender.tender[0].offer[offer].entrega < menorEntrega) {
                menorEntrega = tender.tender[0].offer[offer].entrega
            } 

            if (tender.tender[0].offer[offer].financiacion > mayorFinanciacion) {
                mayorFinanciacion = tender.tender[0].offer[offer].financiacion
            }
        }
        
        // menorEntrega = moment(menorEntrega, "YYYY-MM-DD").startOf('day')
        // console.log('Menor Entrega',menorEntrega)
    
        //Difference in number of days
        // const diasEntrega = moment.duration(menorEntrega.diff(fecha)).asDays();
        const diasEntrega = menorEntrega
        // console.log('Menor Entrega', diasEntrega)
        // console.log('Mayor Financiacion', mayorFinanciacion)

        // console.log('Offers', tender.tender[0].offer)
        // Ciclo entre las Ofetas
        for(var offer in tender.tender[0].offer) {
            // Tomo el Precio de la Ofeta
            const precioPesosOff = tender.tender[0].offer[offer].precioPesos
            // console.log('PrecioPesos', precioPesosOff)

            let precioOff = tender.tender[0].offer[offer].precio
            // console.log('Precio', precioOff)

            const cotizaOff = tender.tender[0].offer[offer].cotizacion
            // console.log('Cotizacion', cotizaOff)

            if (precioOff == 0 && cotizaOff !== 0) {
                precioOff = (precioPesosOff / cotizaOff).toFixed(5)
                // console.log('Nuevo Precio', precioOff)
            }

            // Tomo la Cantidad de la Ofeta
            const cantiOff = tender.tender[0].offer[offer].cantidad
            // console.log('Precio', cantiOff)

            // Tomo la fecha de Entrega de la Ofeta
            let entregaOff = tender.tender[0].offer[offer].entrega
            // entregaOff = moment(entregaOff, "YYYY-MM-DD").startOf('day')
            // console.log('Entrega Oferta',entregaOff)
        
            //Difference in number of days
            // const diasEntregaOff = moment.duration(entregaOff.diff(fecha)).asDays();
            const diasEntregaOff = entregaOff
            // console.log('Dias Entrega Oferta',diasEntregaOff)

            // Tomo la Financiacion de la Ofeta
            const finanOff = tender.tender[0].offer[offer].financiacion
            // console.log('Financiacion', finanOff)

            // console.log('Usuario', tender.tender[0].offer[offer].usuario)
            // Busco el Desempeño del Proveedor
            let supplier = await recSupplier({ usuario: tender.tender[0].offer[offer].usuario })
            // console.log('supplier', supplier.supplier.length)
            
            let desempeno = 0
            if (supplier.supplier.length > 0) {
                desempeno = supplier.supplier[0].desempeno
            }
            tender.tender[0].offer[offer].desempeno = desempeno
            // console.log('Desempeño', desempeno)

            // Ciclo entre los settings
            for(var setting in settingScorings.settingScorings) {
                // console.log(settingScorings.settingScorings[setting].variable)
                settingVariable = settingScorings.settingScorings[setting].variable
                settingPeso = settingScorings.settingScorings[setting].peso

                switch (settingVariable) {
                    case 'scoreProveedor':
                        tender.tender[0].offer[offer].scoreProveedor = (desempeno * settingPeso).toFixed(2) 
                        // console.log('scoreProveedor', tender.tender[0].offer[offer].scoreProveedor);

                        break;
                    case 'scorePrecio':
                        tender.tender[0].offer[offer].scorePrecio = ((precioHisto / precioOff) * 100 * settingPeso).toFixed(2) 
                        // console.log('scorePrecio', tender.tender[0].offer[offer].scorePrecio);

                        break;
                    case 'scoreEntrega':
                        tender.tender[0].offer[offer].scoreEntrega = ((diasEntrega / diasEntregaOff) * 100 * settingPeso).toFixed(2)  
                        // console.log('scoreEntrega', tender.tender[0].offer[offer].scoreEntrega);

                        break;
                    case 'scoreFinanciacion':
                        tender.tender[0].offer[offer].scoreFinanciacion = ((finanOff / mayorFinanciacion) * 100 * settingPeso).toFixed(2)  
                        // console.log('scoreFinanciacion', tender.tender[0].offer[offer].scoreFinanciacion);

                        break;
                    case 'scoreCantidad':
                        if (cantiOff >= cantiLic) {
                            tender.tender[0].offer[offer].scoreCantidad = (100 * settingPeso).toFixed(2)  
                        } else {
                            tender.tender[0].offer[offer].scoreCantidad = 0 
                        }
                        // console.log('scoreCantidad', tender.tender[0].offer[offer].scoreCantidad);

                        break;
                    default:
                        break;
                }
            }

            // Sumo los scorings
            tender.tender[0].offer[offer].scoring = 
                (tender.tender[0].offer[offer].scoreProveedor +
                tender.tender[0].offer[offer].scorePrecio +
                tender.tender[0].offer[offer].scoreEntrega + 
                tender.tender[0].offer[offer].scoreFinanciacion + 
                tender.tender[0].offer[offer].scoreCantidad).toFixed(2) 
        }

        // Ordeno las ofertas según el scoring
        tender.tender[0].offer.sort((a,b) => b.scoring - a.scoring)

        // Grabo las Ofertas
        let i = 1
        for(var offer in tender.tender[0].offer) {
            const newOffer = {
                scoreProveedor: tender.tender[0].offer[offer].scoreProveedor,
                scorePrecio: tender.tender[0].offer[offer].scorePrecio,
                scoreEntrega: tender.tender[0].offer[offer].scoreEntrega,
                scoreCantidad: tender.tender[0].offer[offer].scoreCantidad,
                scoreFinanciacion: tender.tender[0].offer[offer].scoreFinanciacion,
                scoring: tender.tender[0].offer[offer].scoring,
                scoreRanking: i,
                desempeno: tender.tender[0].offer[offer].desempeno
            }

            i++
            // console.log(newOffer)
            let defOffer = await updtOffer({ _id: tender.tender[0].offer[offer]._id }, newOffer)
            // console.log(defOffer.offer)

        }

        res.json({Tender: tender.tender})
    }
    catch(error) {
        // console.log(error)
    }
    
}



