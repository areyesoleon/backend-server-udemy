const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
app.use(fileUpload());
app.put('/', (req, res, next) => {
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: 'No subio archivo',
      errors: {message: 'Debe de seleccionar una imagen'}
    });
  }
  res.status(200).json({
    ok: true,
    mensaje: 'Peticion realizada exitosamente'
  });
});

module.exports = app;