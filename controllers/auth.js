const {response }= require('express');
const Usuario = require('../models/usuario');
const bcrypt  = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');



const login = async (req, res=response)=>{

  const {email, password}=req.body;

  try {
    
    //verificando email
    const usuarioDB=await usuario.findOne({email});
    if(!usuarioDB){
      return res.status(404).json({
        ok:false, 
        msg:'Email no valido'
      });
    }

    //verificando contraseña
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if(!validPassword){
      return res.status(400).json({
        ok:false, 
        msg:'Contraseña no válida'
      });
    }

    //Generar el token-JWT
    const token = await generarJWT(usuarioDB.id);


    res.json({
      ok:true,
      token
    });


  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false, 
      mgs:'Hable con el administrador'
    });
  }
};

const  googleSignIn=async (req, res=response)=>{

  const googleToken=req.body.token; 
  
  try {
    const {name, email, picture}=await googleVerify(googleToken);

    const usuarioDB=await Usuario.findOne({email});
    let usuario; 

    //si no existe el usuario
    if(!usuarioDB){
      usuario=new Usuario({
        nombre:name, 
        email, 
        password:'@@@', 
        img:picture, 
        google:true
      });
    }else{
      //existe el usuario
      usuario=usuarioDB;
      usuario.google=true;
      usuario.password='@@@';
      usuario.img=picture;
    }

    //guardar en la bae de datos
    await usuario.save(); 

    //generar el jsonWEB token personalizado
    const token = await generarJWT(usuario.id);
    res.json({
      ok:true,
      token
    });

  } catch (error) {
    res.status(500).json({
      ok:false, 
      error:error
    })
    
  }

  

};


module.exports = {
  login,
  googleSignIn
};