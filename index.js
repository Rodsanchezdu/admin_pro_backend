const express=require('express');
require('dotenv').config();
const cors = require('cors');

//crear el servidor expreess
const app=express();

//configurar cors
app.use(cors());

//lectura y parseo del body
app.use(express.json());

const {dbConnection}=require('./database/config')


//base de datos
dbConnection();

//directorio publico
app.use( express.static('public') );

//RUTAS
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/uploads', require('./routes/uploads'));





app.listen(process.env.PORT, ()=>{
  console.log('Servidor corriendo en el puerto '+process.env.PORT);
} );