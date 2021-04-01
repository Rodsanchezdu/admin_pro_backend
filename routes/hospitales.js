/*
Ruta: /api/hospitales
*/



const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campo");
const { validarJWT } = require("../middlewares/validar-jwt");

const {
  getHospital, 
  crearHospital, 
  borrarHospital, 
  actualizarHospital
} = require('../controllers/hospitales')

const router = Router();

router.get("/", getHospital);

router.post(
  "/",
  [
    validarJWT,
    check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
    validarCampos
    
  ],
  crearHospital
);

router.put(
  "/:id",
  [
     
  ],
  actualizarHospital
);

router.delete(
  "/:id",
  borrarHospital
);



module.exports = router;


