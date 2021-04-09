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

const actualizarMedico = async (req, res=response)=>{

  const medicoId=req.params.id;
  const usuarioId=req.uid;

  try {

    const medicoDB=await Medico.findById(medicoId);

    if(!medicoDB){

      return res.json({
        ok:false, 
        msg:"Medico no encontrado por id"
      });
    }

    const cambiosMedico={
      usuario:usuarioId, 
      ...req.body
    };

    const medicoActualizado=await Medico.findByIdAndUpdate(medicoId,cambiosMedico,{new:true})
                                        .populate('usuario','nombre')
                                        .populate('hospital','nombre');
    res.json({
      ok:true, 
      nuevoMedico:medicoActualizado
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({
      ok:false, 
      msg:"Hable con el administrador",
      error
    });
  }

 

  
};

const borrarMedico = async (req, res=response)=>{
  
  const medicoId=req.params.id;
  try {

    const medicoDB=await Medico.findById(medicoId);

    if(!medicoDB){

      return res.json({
        ok:false, 
        msg:"Medico no encontrado por id"
      });
    }

    await Medico.findByIdAndDelete(medicoId);

    res.json({
      ok:true, 
      msg:"medico eliminado"
    });

    
  } catch (error) {

    console.log(error);
    res.status(500).json({
      ok:false,
      msg:"hable con el administrador"
    });
    
  }
  
};

const  getMedicosById = async (req, res=response)=>{

  const id = req.params.id;

  try {
    const medicosDB= await Medico.findById(id)
                            .populate('usuario', 'nombre')    
                          .populate('hospital','nombre') 



    res.json({
      ok:true, 
      medico:medicosDB
    });
    
  } catch (error) {
    res.json({
      ok:false, 
      msg:'hable con el administrador'
    });
    
  }
  
};

module.exports={
  getMedicos, 
  crearMedico, 
  borrarMedico, 
  actualizarMedico, 
  getMedicosById
};