const path=require('path');
const fs = require('fs');
const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");



const fileUpload=(req, res=response)=>{

  const tipo=req.params.tipo; 
  const id= req.params.id;

  const tiposPermitidos=['hospitales', 'medicos', 'usuarios'];

  if(!tiposPermitidos){
    return res.status(400).json({
      ok:false,
      msg:"No es un médico, usuario u hospital (tipo)"
    });
  }

  //Validando que exista un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok:false, 
      msg:'no hay ningun archivo'
    });
  }

  //procesando la imagen
  const file =req.files.imagen; //gracias al middleware de express-upload
  const nombreCortado=file.name.split('.');
  const extesionArchivo=nombreCortado[nombreCortado.length-1];

  //validar extension
  const extensionesValidas =['png', 'jpg', 'jpeg', 'gif'];
  if(!extensionesValidas.includes(extesionArchivo)){
    return res.status(400).json({
      ok:false, 
      msg:'no es una extension permitida'
    });
  }

  //generar el nombre del archivo
  const nombreArchivo= `${uuidv4()}.${extesionArchivo}`;

  //path para guardar la imagen
  const path = `./uploads/${tipo}/${nombreArchivo}`;
  

  // Mover la imagen a la base de datos interna
  file.mv(path, (err)=> {
    if (err){
      return res.status(500).json({
        ok:false, 
        msg:"Error al mover la imagen"
      });
    }
    res.json({
      ok:true, 
      msg:'Archivo subido',
      nombreArchivo
    });

  });

  //actualizar imagen: => guardar el nombre de esta en quien lo haya creado ya sea médico o usuario o hospital
  actualizarImagen(tipo, id,  nombreArchivo);

};

const retornaImagen=(req, res=response)=>{
  const tipo = req.params.tipo;
  const foto = req.params.foto;
  
  const pathImg= path.join(__dirname,`../uploads/${tipo}/${foto}`);

  //imagen por defecto
  if(fs.existsSync(pathImg)){

    res.sendFile(pathImg);
  }else{
    const pathImg= path.join(__dirname,`../uploads/no-img.jpg`);
    res.sendFile(pathImg);  
  }

};



module.exports={
  fileUpload, 
  retornaImagen
};