const { response } =require('express');
const Usuario = require('../models/usuario');
const{validationResult} = require('express-validator');
const bcrypt =require('bcryptjs');
const usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
 

const getUsuarios= async (req, res)=>{

  const desde=Number(req.query.desde) || 0;
  console.log(desde); 

  //Estas dos de acá harían lento el proceso y como se pueden esperar al tiempo mejor usar Promise.all
  // const usuarios= await Usuario
  //                       .find({},'nombre email role google')
  //                       .skip(desde) 
  //                       .limit(5);
  // const total = await Usuario.count();

  //Acá va con desestructuración de objetos para arreglos
  const [usuarios, total]=await Promise.all([
    Usuario.find({},'nombre email role google img')
           .skip(desde) 
           .limit(5),
    Usuario.countDocuments()    
  ]);
  
  res.json({
    ok:true,
    usuarios,
    total
  });

};

//==============================================
//            POST
//==============================================
const crearUsuario= async (req, res=response)=>{

  const{email, password,nombre}=req.body;

  try {

    const existeEmail= await Usuario.findOne({email:email});
    
    if(existeEmail){
      return res.status(400).json({
        ok:false,
        msg:'El correo ya existe'
      });
    }
    const usuario=new Usuario(req.body);

    //encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password=bcrypt.hashSync(password, salt);

    //guardar usuario
    await usuario.save();

    //generar token
    const token = await generarJWT(usuario.id);

    res.json({
      ok:true,
      usuario:usuario,
      token
    });
    
  } catch (error) {

    console.log(error);
    res.status( 500 ).json({
      ok:false,
      msg:'error inesperado revisar logs'
    });
  }
};

//==============================================
//            PUT
//==============================================
const actualizarUsuario = async (req, res=response)=>{
  //TODO: Validar token y comprobar si es el usuario correcto
  const uid=req.params.id;
  try {

    const usuarioDB= await Usuario.findById(uid);

    if(!usuarioDB){
      return res.status(404).json({
        ok:false,
        msg:'No existe un usuario por ese id'
      });
    }

    //Actualizaciones: se eliminan de campos porque nunca se usarán. 
    //                 a pesar de lo anterior si quedan existiendo las 
    //                 variables google y password, la razón para sacar
    //                 el email es porque tenemos que ver si se debe 
    //                 actualizar porque donde sea de google no.
    const {password, google, email, ...campos} = req.body;


    //por si no quiere actualizar el correo y evitar el salto de problema
    if(usuarioDB.email===req.body.email){
      delete campos.email; 
    }else{
      //quiere colocarse un email que ya existe
      const existeEmail=await Usuario.findOne({email: req.body.email});

      if(existeEmail){
        return res.status(400).json({
          ok:false,
          msg:'Ya existe un usuario con ese email!'
        });

      }

      //Evitando que personas logueadas con google cambien su correo
      if(!usuarioDB.google){ //o sea no es de google entonces se le permite cambiarlo
        campos.email=email; 
      }else if(usuarioDB.email!==email){ //es usuario de google y en el body viene otro tipo de email
        return res.status(400).json({
          ok:false,
          msg:'Usuarios de google no pueden cambiar su correo'
        });

      }

    }

    

    const usuarioActualizado=await Usuario.findByIdAndUpdate(uid, campos, {new:true});

    res.json({
      ok:true, 
      usuario:usuarioActualizado
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:'Error inesperado'
    });
    
  }
};

//==============================================
//            DELETE
//==============================================
const borrarUsuario = async (req, res=response)=>{
  const uid=req.params.id;
  try {

    const usuarioDB= await Usuario.findById(uid);

    if(!usuarioDB){
      return res.status(404).json({
        ok:false,
        msg:'No existe un usuario por ese id'
      });
    }    

    await Usuario.findByIdAndDelete(uid);

    res.json({
      ok:true, 
      msg:'Usario eliminado'
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:'Error inesperado'
    });
    
  }
  
};

module.exports={
  getUsuarios, 
  crearUsuario,
  actualizarUsuario, 
  borrarUsuario
};