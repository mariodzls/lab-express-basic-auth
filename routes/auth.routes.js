const res = require("express/lib/response")
const bcryptjs = require('bcryptjs')

const User = require('./../models/User.model')
const saltRounds = 10

const router = require("express").Router()



router.get("/registro", (req, res, next) => res.render("register/reg"))

router.post("/registro", (req, res, next)=> {
     const {username, password} = req.body

     bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      console.log('El hash a crear en la BBDD es', hashedPassword)
      return User.create({ username, password: hashedPassword })
    })
    .then(createdUser => res.redirect('/'))
    .catch(error => next(error))
})

router.get("/iniciar", (req, res, next) => res.render("register/init"))

router.post("/iniciar", (req, res, next)=> {
  const { username, password } = req.body

  if (username.length === 0 || password.length === 0) {
    res.render('register/init', { errorMessage: 'Por favor, rellena todos los campos' })
    return
  }

  User
    .findOne({ username })
    .then(user => {
      if (!user) {
        res.render('register/init', { errorMessage: 'Nombre de usuario no registrado en la Base de Datos' })
        return
      } else if (bcryptjs.compareSync(password, user.password) === false) {
        res.render('register/init', { errorMessage: 'La contraseña es incorrecta' })
        return
      } else {
        req.session.currentUser = user
        console.log('El objeto de EXPRESS-SESSION', req.session)
        res.redirect('/perfil')
      }
    })
})



module.exports = router