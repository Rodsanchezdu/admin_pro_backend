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

//RUTAS
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));



app.listen(process.env.PORT, ()=>{
  console.log('Servidor corriendo en el puerto '+process.env.PORT);
} );