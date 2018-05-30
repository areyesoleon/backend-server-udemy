const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;
const Usuario = require('../models/usuario');
//Google
const GOOGLE_CLIENT_ID = require('../config/config').CLIENT_ID;
const SECRET_GOOGLE = require('../config/config').SECRET_GOOGLE;
const { OAuth2Client } = require('google-auth-library');
const   GOOGLE_SECRET = new OAuth2Client(SECRET_GOOGLE);


//======================
//Autenticacion google
//======================
// app.post('/google', (req, res) => {
//   var token = req.body.token || '';

//   const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_SECRET);
//   const ticket = client.verifyIdToken({
//       idToken: token,
//       audience: GOOGLE_CLIENT_ID
//   });

//   ticket.then(data => {
//       res.status(200).json({
//           ok: true,
//           ticket: data.payload,
//           userid: data.payload.sub
//       });
//   }).catch(err => {
//       if (err) {
//           return res.status(400).json({
//               ok: false,
//               mensaje: 'Token no válido',
//               errors: err
//           });
//       }
//   });
// });
// app.post('/google', async (req, res) => {
//   var token = req.body.token;
//   var googleUser = await verify(token)
//   .catch(e => {
//     res.status(403).json({
//       ok: false,
//       mensaje: 'Token no valido',
//       err:e
//     });
//   });
//   res.status(200).json({
//     ok: true,
//     mensaje: 'Google',
//     googleUser: googleUser
//   });
// });

// async function verify(token) {
//   const ticket = await client.verifyIdToken({
//     idToken: token,
//     audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
//     // Or, if multiple clients access the backend:
//     //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
//   });
//   const payload = ticket.getPayload();
//   //const userid = payload['sub'];
//   // If request specified a G Suite domain:
//   //const domain = payload['hd'];
//   return {
//     nombre: payload.name,
//     email: payload.email,
//     img: payload.picture,
//     google:true
//   };
// }

//======================
//Autenticacion normal
//======================

app.post('/', (req, res) => {
  const body = req.body;
  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar usuario',
        errors: err
      });
    }
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas - email',
        errors: err
      });
    }
    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas - password',
        errors: err
      });
    }
    // Crear token!!!
    usuarioDB.password = ':)';
    const token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });
    res.status(200).json({
      ok: true,
      usuario: usuarioDB,
      id: usuarioDB._id,
      token: token
    });
  });
});

module.exports = app;