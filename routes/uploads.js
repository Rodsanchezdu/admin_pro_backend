/*
  ruta: api/uploads
*/

const { Router } = require("express");
const ExpressfileUpload = require('express-fileupload');
const { validarJWT } = require("../middlewares/validar-jwt");

const { fileUpload, retornaImagen } =require('../controllers/uploads');

const router = Router();
router.use(ExpressfileUpload());

//en tipo debe ir si medicos o hospitales o usuarios
router.put( "/:tipo/:id", validarJWT , fileUpload);
router.get( "/:tipo/:foto",  retornaImagen);


module.exports=router;