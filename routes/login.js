const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;
const Usuario = require('../models/usuario');


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