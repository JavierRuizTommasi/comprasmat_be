const User = require('./user.dao')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const SECRET_KEY = require('../auth.config')

const nodemailer = require('nodemailer')
const properties = require('../config/properties')
const EMAIL = require('../config/email')
const { resolveContent } = require('nodemailer/lib/shared')

const Suppliers = require('../suppliers/suppliers.dao')

exports.createUser = async (req, res, next) => {
    const newUser = {
        usuario: req.body.usuario,
        nombre: req.body.nombre,
        email: req.body.email,
        pass: bcrypt.hashSync(req.body.pass),
        perfil: req.body.perfil,
        proveedor: req.body.proveedor,
        contacto: req.body.contacto,
        direccion: req.body.direccion,
        ciudad: req.body.ciudad,
        pais: req.body.pais,
        telefono: req.body.telefono,
        activo: req.body.activo,
        language: req.body.language,
        contacto2: req.body.contacto2,
        email2: req.body.email2,
        contacto3: req.body.contacto3,
        email3: req.body.email3,
        contacto4: req.body.contacto4,
        email4: req.body.email4,
        CUIT: req.body.CUIT
    }

    // console.log('newUser', newUser)

    const supplier = await Suppliers.findOne({ CUIT: newUser.CUIT }, (err, supplier) => {
      // console.log('Find supplier',supplier)

      if (err) return res.send({ message: 'Server error!' });
      if (!supplier) {
        // Sino existe lo creo
        const newSupplier = {
          codigo: 0,
          usuario: newUser.usuario,
          nombre: newUser.usuario,
          CUIT: newUser.CUIT,
          desempeno: 0,
          activo: true
        }
        // console.log('newSupplier',newSupplier)
        
        Suppliers.create(newSupplier, (err, supplier) => {
            // console.log('Create supplier',supplier)
            if (err) res.send({ message: 'Server error!' });
        })
      }
    })

    // console.log('Prev supplier', supplier)
    if (supplier) {
        newUser.usuario = supplier.usuario
        // console.log('newUser 2', newUser )
    }

    // console.log('New User', newUser)
    const user = await User.create(newUser, (err, user) => {
      // console.log('Def User', user)
      if (err && err.code === 11000) return res.send({ message: 'Email already exists' })
      if (err) res.json({ message: err.message })

      // console.log('User created')
      // res.send({ Email: info.response})
      
      const dataUser = {
          usuario: user. usuario,
          nombre: user.nombre,
          email: user.email
      }
      // response 
      // console.log('User created', dataUser)
      res.send({ dataUser });
      //res.json({ message: 'User created successfully'})
    })
} 

exports.welcome = (req, res, next) => {
  // console.log(req.params.email)
  User.findOne({ email: req.params.email }, async (err, user) => {
    if (err) return res.send({ message: 'Server error!' });
    if (!user) {
      // id does not exist
      res.send({ message: 'User not found' });
    } else {
      const newUser = {
        id: user.id,
        usuario: user.usuario,
        nombre: user.nombre,
        email: user.email,
        language: user.language
    }
  
    // console.log(newUser)
    const expiresIn = '1d';
    const accessToken = jwt.sign({ id: newUser.id }, SECRET_KEY, { expiresIn: expiresIn })
    
    if (newUser.language == 'es') {
        contentHTML = `
          <div style="display: flex;">
              <img style="height: 57px; width: 95px; margin-right: 10px;" src="cid:logo"/>
              <h1 style="font:24px Helvetica,Arial,sans-serif; font-weight: bold; line-height:1.5;">Activaci&oacute;n cuenta de Usuario Proveedor</h1>
          </div>
          <br>
          <p style="font:14px Helvetica,Arial,sans-serif;">Estimado Proveedor <strong>${newUser.nombre}</strong> (Usuario: <strong>${newUser.usuario})</strong>.</p>
          <p style="font:14px Helvetica,Arial,sans-serif;">Si le interesa acercarnos su ofertas por favor haga click en el link de abajo asi podremos confirmar su cuenta de usuario.
            <br>
            <a href="${properties.URLAPI}autentication/${accessToken}">${properties.URLAPI}autentication/${accessToken}</a>
          </p>
          <p style="font:14px Helvetica,Arial,sans-serif;">Recuerde que de esta manera usted podr&aacute; acercarnos su oferta para ser tenido en cuenta en el an&aacute;lisis de la compra de los insumos que usted nos pudiera proveer al momento de generarse una Solicitud de Cotizaci&oacute;n.</p>
        `
    } else {
        contentHTML = `
          <div style="display: flex;">
              <img style="height: 57px; width: 95px; margin-right: 10px;" src="cid:logo"/>
              <h1 style="font:24px Helvetica,Arial,sans-serif; font-weight: bold; line-height:1.5;">User Supplier account activation</h1>
          </div>
          <br>
          <p style="font:14px Helvetica,Arial,sans-serif;">Dear Supplier <strong>${newUser.nombre}</strong> (User: <strong>${newUser.usuario})</strong>.</p>
          <p style="font:14px Helvetica,Arial,sans-serif;">If you are interest to send us your Request for quotations please click on the link below in order we can activate your user account
            <br>
            <a href="${properties.URLAPI}autentication/${accessToken}">${properties.URLAPI}autentication/${accessToken}</a>
          </p>
          <p style="font:14px Helvetica,Arial,sans-serif;">Take into account that this is the way you will send us your Request for quotations and be considered as a supplie provider during the purchase process at the time the Requests are generated.</p>
        `
    }
    // console.log(contentHTML)
  
    // // Gmail
    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: EMAIL.EMAIL,
    //         pass: EMAIL.PASS
    //     }
    // })
  
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
        mailTitu = 'PROAGRO - Activación cuenta de Usuario Proveedor' 
        fromMsg = '"Proagro contacto" <proagro@neocore.com.ar>'
    } else {
        mailTitu = 'PROAGRO - User Supllier account activation' 
        fromMsg = '"Proagro contact" <proagro@neocore.com.ar>'
    }
    
    // const mailOptions = {
    //   from: fromMsg, 
    //   to: EMAIL.EMAIL_AUTORIZ,
    //   subject: mailTitu,
    //   html: contentHTML
    // }

    const mailOptions = {
        from: '"Proagro contacto" <proagro@neocore.com.ar>', 
        to: newUser.email,
        bcc: EMAIL.EMAIL_AUTORIZ,
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
            res.json({ message: error.message })
        } else {
            console.log('Email sent', info.response)
            // res.send({ Email: info.response})
            // response 
            res.send({ newUser });
            //res.json({ message: 'User created successfully'})
        }
      })
    }
  })
}

exports.autenticateUser = (req, res, next) => {
    const token = req.params.token

    // const userData = {
    //   id: req.body.id,
    //   pass: req.body.pass,
    //   newpass: req.body.newpass
    // }
    // console.log(userData)

    // console.log(token)

    if (token) {
      jwt.verify(token, SECRET_KEY, (err, decoded) => {      
          if (err) {
              console.log('Token inválida')
              res.send({mensaje: 'Token inválida'})

          } else {
              const { id } = decoded;    
              // console.log(decoded)
              console.log('Token OK.', decoded)

              User.findOne({ _id: id }, (err, user) => {
                if (err) return res.send({ message: 'Server error!' });
          
                // console.log(user)
                if (!user) {
                  // id does not exist
                  res.send({ message: 'User not found' });
                } else {
                  const dataUser = {
                    id: user.id,
                    activo: true
                  }
                  User.update({ _id: dataUser.id }, dataUser, (err, user) => {
                    if (err) res.json({ error: err})
                      // console.log('dataUser', dataUser)
                      // console.log('user',user)
                      
                      // if (user.language == 'es') {
                      //   contentHTML = `
                      //     <h1>PROAGRO - Cuenta de Usuario Proveedor:</h1>
                      //     <ul>
                      //         <li>Usuario: <strong>${user.usuario}</strong></li>
                      //         <li>Nombre: <strong>${user.nombre}</strong></li>
                      //         <li>Email: <strong>${user.email}</strong></li>
                      //     </ul>
                  
                      //     <h2>Cuenta activada!!!</h2>
                      //     <p><a href="${EMAIL.URLHOME}">Login</a></p>
                      //     <br>
                      //   `
                      // } else {
                      //   contentHTML = `
                      //     <h1>PROAGRO - User Supplier account:</h1>
                      //     <ul>
                      //         <li>User: <strong>${user.usuario}</strong></li>
                      //         <li>Name: <strong>${user.nombre}</strong></li>
                      //         <li>Email: <strong>${user.email}</strong></li>
                      //     </ul>
                  
                      //     <h2>Account activated!!!</h2>
                      //     <p><a href="${EMAIL.URLHOME}">Ir a la wev</a></p>
                      //     <br>
                      //   `
                      // }

                      // res.json({message: 'User activated'})        
                      const logUrl = properties.URLHOME + '/login/welcome'        
                      res.redirect(logUrl)        

                  })
                }
              })
          }
      });
  } else {
      console.log('Token no provista')
      // res.redirect('/')
      res.send({mensaje: 'Token no provista'})
  }

}

// exports.udpatePass = (req, res, next) => {
//   const userData = {
//     id: req.body.id,
//     pass: req.body.pass,
//     newpass: req.body.newpass
//   }
//   // console.log(userData)

//   User.findOne({ _id: userData.id }, (err, user) => {
//     if (err) return res.send({ message: 'Server error!' });

//     if (!user) {
//       // email does not exist
//       res.send({ message: 'User not found' });
//     } else {
//       const resultPassword = bcrypt.compareSync(userData.pass, user.pass)
//       if (resultPassword) {
//         const dataUser = {
//           id: userData.id,
//           pass: bcrypt.hashSync(userData.newpass)
//         }
//         User.update({ _id: dataUser.id }, dataUser, (err, user) => {
//           if (err) res.json({ error: err})
//           // console.log(dataUser)
//           res.json({message: 'Password updated successfully'})        
//         })
//       } else {
//         // password wrong
//         res.send({ message: 'Invalid Password' });
//       }
//     }
//   })
// }

exports.udpatePass = (req, res, next) => {
  const userData = {
    id: req.body.id,
    pass: req.body.pass,
    newpass: req.body.newpass
  }
  // console.log(userData)

  User.findOne({ _id: userData.id }, (err, user) => {
    if (err) return res.send({ message: 'Server error!' });

    if (!user) {
      // email does not exist
      res.send({ message: 'User not found' });
    } else {
      // console.log(userData)

      let resultPassword = true
      if (userData.pass === '') {     
      } else {
        resultPassword = bcrypt.compareSync(userData.pass, user.pass)
      }

      if (resultPassword) {
        const dataUser = {
          id: userData.id,
          pass: bcrypt.hashSync(userData.newpass)
        }
        User.update({ _id: dataUser.id }, dataUser, (err, user) => {
          if (err) res.json({ error: err})
          // console.log(dataUser)
          res.send({ dataUser });
        })
      } else {
        // password wrong
        res.send({ message: 'Invalid Password' });
      }
    }
  })
}

exports.loginUser = (req, res, next) => {
    const userData = {
      email: req.body.email,
      password: req.body.password
    }
    User.findOne({ email: userData.email }, (err, user) => {
      if (err) return res.send({ message: 'Server error!' });
  
      if (!user) {
        // email does not exist
        res.send({ message: 'User not found' });
      } else {
        const resultPassword = bcrypt.compareSync(userData.password, user.pass);
        if (resultPassword) {
          const expiresIn = 3600;
          const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: expiresIn });
  
          const dataUser = {
            id: user.id,
            usuario: user.usuario,
            nombre: user.nombre,
            email: user.email,
            perfil: user.perfil,
            language: user.language,
            activo: user.activo,
            proveedor: user.proveedor,
            accessToken: accessToken,
            expiresIn: expiresIn
          }
          res.send({ dataUser });
        } else {
          // password wrong
          res.send({ message: 'Invalid Password' });
        }
      }
    });
  }
  
exports.getUsers = (req, res, next) => {
    User.get({}, (err, users) => {
        if (err) res.json({ error: err})
        // res.json({Users: users})
        res.send({Users: users})
    })
}

// exports.getUser = (req, res, next) => {
//     User.get({ _id: req.params.id }, (err, user) => {
//         if (err) res.json({ error: err })
//         res.send({user})
//     })
// }

exports.getUser = (req, res, next) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
      if (err) res.json({ error: err })
      res.json({User: user})
  })
}

exports.datosUser = (req, res, next) => {
    let id = req.decoded.id
    // console.log(id)
    
    User.findOne({ _id: id }, (err, user) => {
        if (err) return res.send({ message: 'Server error!' });
  
        if (!user) {
          // id does not exist
          res.send({ message: 'Something is wrong' });
        } 
        else {
            // res.json({user : {name:user.nombre, email:user.email, createdAt: user.createdAt, updatedAt: user.updatedAt}});
          res.json({User: user})
        }
    })
}
  
exports.checkUser = (req, res, next) => {
    let id = req.decoded.id
    // console.log("id:",id)
    
    User.findOne({ _id: id }, (err, user) => {
        if (err) return res.send({ message: 'Server error!' });
        if (!user) {
            // id does not exist
            res.send({ message: 'Something is wrong' });
        } 
        else {
            res.send({user : {
              id:user.id, 
              nombre:user.nombre, 
              email:user.email, 
              perfil:user.perfil, 
              createdAt: user.createdAt, 
              updatedAt: user.updatedAt,
              language: user.language,
              proveedor: user.proveedor,
              usuario: user.usuario
            }});
        }
    })
}

// exports.checkUser = (req, res, next) => {
//   let id = req.decoded.id
//   // console.log("id:",id)
  
//   User.findOne({ _id: id }, (err, user) => {
//     let messaje = ''
//     if (err) message = 'Server error!'

//     if (!user) {
//         // id does not exist
//         message = 'Algo anduvo mal'
//     } 
//     else {
//         message = {user : {
//           id:user.id, 
//           nombre:user.nombre, 
//           email:user.email, 
//           perfil:user.perfil, 
//           createdAt: user.createdAt, 
//           updatedAt: user.updatedAt,
//           language: user.language,
//           proveedor: user.proveedor,
//           usuario: user.usuario
//         }}
//     }
//     console.log(messaje)
//     return new Promise((resolve) => { 
//       resolve(res.send(message))
//     })
//   })
// }

exports.udpateUser = (req, res, next) => {
    // No paso el req.body porque tiene la clave en blanco y da error
    const user = {
        usuario: req.body.usuario,
        nombre: req.body.nombre,
        email: req.body.email,
        perfil: req.body.perfil,
        proveedor: req.body.proveedor,
        contacto: req.body.contacto,
        direccion: req.body.direccion,
        ciudad: req.body.ciudad,
        pais: req.body.pais,
        telefono: req.body.telefono,
        activo: req.body.activo,
        language: req.body.language,
        contacto2: req.body.contacto2,
        email2: req.body.email2,
        contacto3: req.body.contacto3,
        email3: req.body.email3,
        contacto4: req.body.contacto4,
        email4: req.body.email4,
        CUIT: req.body.CUIT
    }
    // console.log(user)

    User.update({ _id: req.params.id }, user, (err, user) => {
        if (err) res.json({ error: err})
        res.json({message: 'User updated successfully'})        
    })
}

exports.udpateLang = (req, res, next) => {
    // console.log(req.body)
    const lang = {
        language: req.body.language
    }

    User.update({ _id: req.params.id }, lang, (err, lang) => {
        if (err) res.json({ error: err})
        res.json({message: 'Language updated successfully'})        
    })
}

exports.deleteUser = (req, res, next) => {
    User.delete({ _id: req.params.id }, (err, user) => {
        if (err) res.json({ error: err})
        res.json({message: 'User deleted successfully'})
    })
}

exports.logoutUser = (req, res, next) => {
    res.json({'logout': 'ok'});
}

exports.unsubscribe = (req, res, next) => {
    let id = req.decoded.id
    
    User.update({ _id: id }, {activo: false}, (err, user) => {
        if (err) res.json({ error: err})
        console.log('Unsubscribe Ok')
        // res.json({message: 'User unsubscribe successfully'})
        res.send(`<div style="display: flex;">
                      <h3 style="font:24px Helvetica,Arial,sans-serif; font-weight: bold; line-height:1.5;">User unsubscribe successfully</h3>
                  </div>`)
    })
}

