const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

const chalk = require('chalk')
const dbURL = require('./properties').DB

// custom console
const connected = chalk.bold.cyan
const error = chalk.bold.red
const termination = chalk.bold.magenta

mongoose.set('useUnifiedTopology', true)
// mongoose.set('useCreateIndex', true)
// mongoose.set('useNewUrlParser', true)

// const connection = mongoose.connection
// connection.on('error', console.log)

module.exports = async () => {
    await mongoose.connect(dbURL, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
    .then(conn => {
        console.log(connected('Mongo connected! on', dbURL))
    })
    .catch(err => console.log(error(`Connection has error ${err}`)))

    await process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongoose is disconnected')
            process.exit(0)
        })
    })
}