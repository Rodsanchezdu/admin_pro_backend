/*
  ruta: api/todo/:busqueda
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campo");
const { validarJWT } = require("../middlewares/validar-jwt");

const { getTodo,getDocumentosColeccion }=require('../controllers/busquedas');

const router = Router();

router.get(
  "/:param",
  [
    validarJWT,
    validarCampos

  ],
  getTodo);

router.get(
  "/coleccion/:tabla/:busqueda",
  [
    validarJWT,
    validarCampos

  ],
  getDocumentosColeccion);


  module.exports=router;