const { response } = require('express');
const Medico = require('../models/medico');

const  getMedicos = async (req, res=response)=>{

  const medicosDB= await Medico.find()
                            .populate('usuario', 'nombre')    
                          .populate('hospital','nombre')



  res.json({
    ok:true, 
    medicos:medicosDB
  });
};

const  crearMedico = async (req, res=response)=>{

  const uid = req.uid;
  const medico = new Medico({
    usuario:uid,  
    ...req.body //como mínimo el nombre debe ir acá
  });

  try {

    const medicoDB= await medico.save();
    console.log("medicoDB", medicoDB);
    
    res.json({
      ok:true, 
      medico:medicoDB
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:"hable con el administrador"
    });
    
  }
  
};

const actualizarMedico = (req, res=response)=>{
  res.json({
    ok:true, 
    msg:'actualizarMedico'
  });
};

const borrarMedico = (req, res=response)=>{
  res.json({
    ok:true, 
    msg:'BorrarMedico'
  });
};


module.exports={
  getMedicos, 
  crearMedico, 
  borrarMedico, 
  actualizarMedico
};