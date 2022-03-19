// module.exports = {
//     PORT: process.env.PORT || 8080,
//     DB: 'mongodb+srv://apiUser:compras8585@cluster0.gqjxv.mongodb.net/prod?retryWrites=true&w=majority',
//     CHECK_NEWTENDER: 300000,
//     CHECK_1HORA: 3600000,
//     URLAPI: 'https://proagrocompras.herokuapp.com/api/',
//     URLHOME: 'http://proveedores.cf'
//
// }
module.exports = {
    PORT: process.env.PORT || 8080,
    // DB: 'mongodb://127.0.0.1:27017/test',
    // DB: 'mongodb+srv://apiUser:compras8585@cluster0.gqjxv.mongodb.net/test?retryWrites=true&w=majority',
    // DB: 'mongodb+srv://apiUser:compras8585@cluster0.gqjxv.mongodb.net/prod?retryWrites=true&w=majority',
    // DB: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/prod',
    DB: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/test',
    // DBLogs: process.env.DATABASE_LOGS || 'logsProd',
    DBLogs: process.env.DATABASE_LOGS || 'logsTest',
    //DB: 'mongodb://myTest:myTest@66.97.44.230:27017/test',
    //DB: process.env.PORT == 8080 ? 'mongodb://127.0.0.1:27017/test',
    CHECK_NEWTENDER: process.env.CHECK_NEWTENDER || 30000,
    CHECK_1HORA: process.env.CHECK_1HORA || 3600000,
    URLAPI: process.env.URLAPI || 'http://localhost:8080/api/',
    URLHOME: process.env.URLHOME || 'http://localhost:4200'
}