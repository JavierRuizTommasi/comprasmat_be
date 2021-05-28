const cors = require('cors');
const express = require('express')
const bodyParser = require('body-parser')
const properties = require('./config/properties')
const Routes = require('./routes')
const db = require('./config/database')

var morgan = require('morgan')

// Init mongoose
const mongoose = require('mongoose')
mongoose.set('useUnifiedTopology', true)
mongoose.set('useCreateIndex', true)

const connection = mongoose.connection
connection.on('error', console.log)

// Init db
db()

const bodyParserJson = bodyParser.json()
const bodyParserURLEncoded = bodyParser.urlencoded({ extended: true})
const app = express()

// Init Morgan for showing the calls in dev environment
app.use(morgan('dev'))
app.use(cors({
    origin: '*',
}));

app.use(bodyParserJson)
app.use(bodyParserURLEncoded)

// GridFs
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

// Aumenta el limite de la medida del request
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Init routes
const router = express.Router()

// Init express router
app.use('/api', router)
Routes(router)

app.listen(properties.PORT, () => console.log(`Server is running on ${properties.PORT}`))

if (properties.CHECK_NEWTENDER) {
    const MailsToSuppliers = require('./mailsToSuppliers/mailsToSuppliers.controller')

    var http = require('http');
    var request = require('request');

    // console.log(properties.URLAPI)
    
    var requestLoop = setInterval(function(){
    request({
        url: properties.URLAPI+"sendMailsToSuppliers",
        method: "GET",
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10,
        form: {email: 'send1st'}
    },function(error, response, body){
        if(error){
            console.log('error: ' + error);
        }else{
            console.log('sucess!' + Date());
        }
    });
    }, properties.CHECK_NEWTENDER);

    var requestSend48 = setInterval(function(){
    request({
        url: properties.URLAPI+"sendMailsToSuppliers",
        method: "GET",
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10,
        form: {email: 'send48'}
    },function(error, response, body){
        if(error){
            console.log('error: ' + error);
        }else{
            console.log('checked!' + Date());
        }
    })
    }, properties.CHECK_NEWTENDER);
    
    var requestSend72 = setInterval(function(){
    request({
        url: properties.URLAPI+"sendMailsToSuppliers",
        method: "GET",
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10,
        form: {email: 'send72'}
    },function(error, response, body){
        if(error){
            console.log('error: ' + error);
        }else{
            console.log('checked!' + Date());
        }
    })
    }, properties.CHECK_NEWTENDER);
}

