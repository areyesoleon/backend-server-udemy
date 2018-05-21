// Requires
const express = require('express');
const mongoose = require('mongoose');
// Inicializar variables
const app = express();

//Conexion DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res)=>{
   if(err) throw err;
   console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online' );
});

//Rutas
app.get('/',(req,res,)=>{
   res.status(403).json({
      ok:true,
      mensaje:'Peticion realizada exitosamente'
   });
});

//Escucar peteciones
app.listen(3000, ()=>{
   console.log('express server 3000: \x1b[32m%s\x1b[0m', 'online' );
});