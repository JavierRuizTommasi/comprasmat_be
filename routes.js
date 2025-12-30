const jwt = require('jsonwebtoken');
const SECRET_KEY = require('./auth.config');

const Users = require('./users/user.controller')
const Tenders = require('./tenders/tenders.controller')
const Offers = require('./offers/offers.controller')
const Products = require('./products/products.controller')
const myProducts = require('./myproducts/myproducts.controller')
const Samples = require('./samples/samples.controller')
const Emails = require('./emails/emails.controller')
const Suppliers = require('./suppliers/suppliers.controller')
const SettingScorings = require('./settingScorings/settingScorings.controller')
const MailsToSuppliers = require('./mailsToSuppliers/mailsToSuppliers.controller')
const Uploads = require('./uploads/uploads.controller')
const Cotizaciones = require('./cotizaciones/cotizaciones.controller')
const Helps = require('./help/help.controller')

// GridFs
const properties = require('./config/properties')
const dbURL = properties.DB
const uuid = require('uuid').v4
const path = require('path')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const crypto = require('crypto');

// create storage engine
const storage = new GridFsStorage({
    url: dbURL,
    file: (req, file) => {
        // console.log('file',file)
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname)
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    },
    options: { useNewUrlParser: true, useUnifiedTopology: true }
});

// const upload = multer({ storage });

// JWT
const rutasProtegidas = (req, res, next) => {
    let token = ''
    if(req.headers['access-token']) {
        token = req.headers['access-token'];
    } else {
        token = req.params.token;
    }

    // console.log(token)
    // console.log("req.id", req.params.id)

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {      
            if (err) {
                console.log('Token inválida')
                //res.redirect('/')
                res.send({mensaje: 'Token inválida'})

            } else {
                req.decoded = decoded;    
                // console.log(req.decoded)
                console.log('Token OK.')
                next();
            }
        });
    } else {
        console.log('Token no provista')
        // res.redirect('/')
        res.send({mensaje: 'Token no provista'})
    }
}

module.exports = (router) => {
    // Expose available models to clients
    router.get('/models', (req, res) => {
        res.json({
            availableModels: properties.AVAILABLE_MODELS || [],
            claudeHaiku45Enabled: !!properties.CLAUDE_HAIKU_4_5_ENABLED
        })
    })

    router.post('/register', Users.createUser)
    router.post('/login', Users.loginUser)
    router.get('/users', Users.getUsers)
    router.get('/users/:id', Users.getUser)
    router.get('/check', rutasProtegidas, Users.checkUser)
    router.put('/users/:id', Users.udpateUser)
    router.put('/pass', Users.udpatePass)
    router.delete('/users/:id', Users.deleteUser)
    router.get('/logout', Users.logoutUser)
    router.get('/autentication/:token', Users.autenticateUser)
    router.get('/welcome/:email', Users.welcome)
    router.get('/unsubscribe/:token', rutasProtegidas, Users.unsubscribe)
    router.put('/language/:id', Users.udpateLang)

    router.get('/tenders', Tenders.getTenders)
    router.get('/tenders/:id', Tenders.getTender)
    router.get('/tendersactives', Tenders.getTendersActives)
    router.post('/tenders', Tenders.createTenders)
    router.put('/tenders/:id', Tenders.udpateTenders)
    router.delete('/tenders/:id', Tenders.deleteTenders)
    router.get('/sendtender', Tenders.sendTenders)
    router.put('/updateScoring/:id', Tenders.updateScoring)

    router.get('/offers', Offers.getOffers)
    router.get('/offers/:id', Offers.getOffer)
    router.post('/offers', Offers.createOffers)
    router.put('/offers/:id', Offers.udpateOffers)
    router.delete('/offers/:id', Offers.deleteOffers)
    router.get('/findmyoffers/:usuario', Offers.findMyOffers)
    router.put('/updateOfferStates/:id', Offers.udpateOfferStates)
    router.put('/offersRemoveUpload/:id', Offers.removeUpload)

    router.get('/samples', Samples.getSamples)
    router.get('/samples/:id', Samples.getSamples)
    router.post('/samples', Samples.createSamples)
    router.put('/samples/:id', Samples.udpateSamples)
    router.delete('/samples/:id', Samples.deleteSamples)
    router.get('/findmysamples/:usuario', Samples.findMySamples)

    router.get('/products', Products.getProducts)
    router.get('/products/:id', Products.getProduct)
    router.post('/products', Products.createProduct)
    router.put('/products/:id', Products.udpateProduct)
    router.delete('/products/:id', Products.deleteProduct)

    router.get('/myproducts', myProducts.getMyProducts)
    router.get('/myproducts/:id', myProducts.getMyProduct)
    router.post('/myproducts', myProducts.createMyProduct)
    router.put('/myproducts/:id', myProducts.udpateMyProduct)
    router.delete('/myproducts/:id', myProducts.deleteMyProduct)
    router.get('/findmyproducts/:usuario', myProducts.findMyProducts)
    router.post('/insertmyproducts', myProducts.insertMyProducts)
    router.put('/deletemyproducts', myProducts.deleteMyProductsGroup)

    router.post('/sendemail', Emails.sendEmail)

    router.get('/suppliers', Suppliers.getSuppliers)
    router.get('/suppliers/:id', Suppliers.getSupplier)
    router.get('/mysupplier/:usuario', Suppliers.getMySupplier)
    router.post('/suppliers', Suppliers.createSupplier)
    router.put('/suppliers/:id', Suppliers.udpateSupplier)
    router.delete('/suppliers/:id', Suppliers.deleteSupplier)
    router.put('/suppliersAssignUpload/:id', Suppliers.assignUpload)
    router.put('/suppliersRemoveUpload/:id', Suppliers.removeUpload)

    router.get('/settingScorings', SettingScorings.getSettingScorings)
    router.get('/settingScorings/:id', SettingScorings.getSettingScoring)
    router.post('/settingScorings', SettingScorings.createSettingScoring)
    router.put('/settingScorings/:id', SettingScorings.udpateSettingScoring)
    router.delete('/settingScorings/:id', SettingScorings.deleteSettingScoring)

    router.get('/mailsToSuppliers', MailsToSuppliers.getMailsToSuppliers)
    router.post('/mailsToSuppliers', MailsToSuppliers.createMailsToSupplier)
    router.get('/sendMailsToSuppliers', MailsToSuppliers.sendMailsToSuppliers)
    // router.get('/redirTender/:token/:tender/:prod', MailsToSuppliers.redirTender)
    router.get('/getMailsToSuppliers', MailsToSuppliers.getMailsToSuppliers)
 
    router.post('/upload', multer({storage}).single('file'), Uploads.createUpload)
    router.post('/uploads', multer({storage}).array('file',12), Uploads.createUploads)
    router.get('/download/:_id', Uploads.download)
    router.get('/uploads', Uploads.getUploads)
    router.get('/uploads/:id', Uploads.getUpload)
    router.delete('/uploads/:id', Uploads.deleteUpload)

    router.get('/dolar', Cotizaciones.getDolar)

    router.get('/help', Helps.getHelps)
    router.get('/help/:id', Helps.getHelp)
    router.post('/help', Helps.createHelp)
    router.put('/help/:id', Helps.udpateHelp)
    router.delete('/help/:id', Helps.deleteHelp)

    router.get('*', (req,res) => res.redirect('/'))

}