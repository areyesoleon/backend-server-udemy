// Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// Inicializar variables
const app = express();

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//Importar Rutas
const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const loginRoutes = require('./routes/login');
const hospitalRoutes = require('./routes/hospital');
const medicoRoutes = require('./routes/medico');
const busquedaRoutes = require('./routes/busqueda');
const uploadRoutes = require('./routes/upload');
//Conexion DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res)=>{
   if(err) throw err;
   console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online' );
});

//Rutas
app.use('/usuario',usuarioRoutes);
app.use('/hospital',hospitalRoutes);
app.use('/medico',medicoRoutes);
app.use('/login',loginRoutes);
app.use('/busqueda',busquedaRoutes);
app.use('/upload',uploadRoutes);
app.use('/',appRoutes);

//Escucar peteciones
app.listen(3000, ()=>{
   console.log('express server 3000: \x1b[32m%s\x1b[0m', 'online' );
});