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
  actualizarMedico, 
  getMedicosById
} = require('../controllers/medicos');
const router = Router();

router.get(
  "/",
  validarJWT, 
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
     validarJWT,
     check('nombre', 'El nombre es necesario para actualizar').not().isEmpty(),
     validarCampos
  ],
  actualizarMedico
);

router.delete(
  "/:id",
  [
    validarJWT,
 ],
  borrarMedico
);

router.get(
  "/:id",
  [
    validarJWT,
 ],
  getMedicosById
);



module.exports = router;


