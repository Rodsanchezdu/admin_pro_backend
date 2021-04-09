const jwt =require('jsonwebtoken');
const Usuario=require('../models/usuario');



const validarJWT=(req, res, next)=>{

  //Leer el token
  const token =req.header('x-token');

  if(!token){
    return res.status(401).json({
     ok:false,
     msg:'no hay token en la petición' 
    });
  }

  try {
    const {uid}=jwt.verify(token, process.env.JWT_SECRET);
    console.log('El token está bien');
    console.log(uid);
    
    //se agrega data en el request
    req.uid=uid;
    next();


  } catch (error) {
    return res.status(401).json({
      ok:false, 
      msg:'Token no valido'
    });
    
  }
};

const validarAdminRol=async (req, res, next)=>{
  //como va despues de valoidarJWT ya tengo el id
  try {
    const usuarioDB=await Usuario.findById(req.uid);
    if(!usuarioDB){
      return res.status(404).json({
        ok:false, 
        mgs:'Usuario no existe'
      });
    }

    if(usuarioDB.role!=='ADMIN_ROLE'){
      return res.status(403).json({
        ok:false, 
        mgs:'No tiene permisos para hacer esto'
      });
    }

    next();
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:'hable con el administrador'
    });
    
  }


}

const validarAdminRol_o_mismoUsuario=async (req, res, next)=>{
  //como va despues de valoidarJWT ya tengo el id
  const uid=req.uid; 
  const id = req.params.id; 
  try {
    const usuarioDB=await Usuario.findById(uid);
    if(!usuarioDB){
      return res.status(404).json({
        ok:false, 
        mgs:'Usuario no existe'
      });
    }

    if(usuarioDB.role!=='ADMIN_ROLE' && uid!==id){
      return res.status(403).json({
        ok:false, 
        msg:'No tiene permisos para hacer esto'
      });
    }

    next();
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:'hable con el administrador'
    });
    
  }


}


module.exports={
  validarJWT, 
  validarAdminRol,
  validarAdminRol_o_mismoUsuario
};