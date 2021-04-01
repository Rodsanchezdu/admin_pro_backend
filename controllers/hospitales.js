const { response } = require('express');
const Hospital = require('../models/hospital');



const getHospital = async (req, res=response)=>{

  const hospitalesDB=await Hospital.find()
                                  .populate('usuario','nombre');
  console.log(hospitalesDB);

  res.json({
    ok:true, 
    hospitales:hospitalesDB
  });
};

const crearHospital = async (req, res=response)=>{

  const uid=req.uid; // al validar el token este se graba, entonces ya se tiene en este punto. 
  const hospital=new Hospital({
    usuario:uid,
    ...req.body //pondrá todas las propiedades que hayan acá así no se tienen que poner una a una
  });  //...req.body extraera todo lo que venga ahí como propiedades
  
  try {
    

    const hospitalDB = await hospital.save(); 
    console.log(hospitalDB);

    res.json({
      ok:true, 
      hospital:hospitalDB
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:'Hable con el administrador'
    })
  }

  
};

const actualizarHospital = (req, res=response)=>{
  res.json({
    ok:true, 
    msg:'ActualizarHospital'
  });
};

const borrarHospital = (req, res=response)=>{
  res.json({
    ok:true, 
    msg:'borrarHospital'
  });
};


module.exports={
  getHospital, 
  crearHospital, 
  borrarHospital, 
  actualizarHospital
};