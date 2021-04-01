/*
Ruta: /api/medicos
*/



const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campo");
const { validarJWT } = require("../middlewares/validar-jwt");

const {
  getMedicos, 
  crearMedico, 
  borrarMedico, 
  actualizarMedico
} = require('../controllers/medicos');
const router = Router();

router.get(
  "/",
  [
    

  ], 
  getMedicos);

router.post(
  "/",
  [
    validarJWT,
    check('nombre', 'el nombre es requerido').not().isEmpty(),
    check('hospital', 'el hospital id debe ser valido').isMongoId(),
    validarCampos
  ],
  crearMedico
);

router.put(
  "/:id",
  [
     
  ],
  actualizarMedico
);

router.delete(
  "/:id",
  borrarMedico
);



module.exports = router;


