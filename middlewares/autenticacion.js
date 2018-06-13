const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;
// Verificar token
exports.vericaToken = function(req,res,next){
  const token = req.query.token;
  jwt.verify(token, SEED, (err, decoded) => {
    if(err){
      return res.status(401).json({
        ok: false,
        mensaje: 'Token incorrecto',
        errors: err
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
};

// Verificar admin
exports.vericaADMIN_ROLE = function(req,res,next){
  const usuario = req.usuario;
  if(usuario.role === 'ADMIN_ROLE'){
    next();
    return;
  } else {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token incorrecto',
      errors: {message: 'No es administrador'}
    });
  }
};

// Verificar admin o mismo usuario
exports.vericaADMIN_O_MISMOUSUARIO = function(req,res,next){
  const usuario = req.usuario;
  const id = req.params.id
  if(usuario.role === 'ADMIN_ROLE' || usuario._id === id){
    next();
    return;
  } else {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token incorrecto',
      errors: {message: 'No es administrador'}
    });
  }
};