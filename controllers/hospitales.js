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

const actualizarHospital = async (req, res=response)=>{

  const hospitalId=req.params.id;
  const usuarioId=req.uid; //esto se tiene porque se paso por la validación de jwt

  try {

    const hospitalDB=await Hospital.findById(hospitalId);
    if(!hospitalDB){
      return res.json({
        ok:false, 
        msg:"Hospital no encontrado por id"
      });
    }

    const cambiosHospital={
      ...req.body, //se espera que venga el nombre
      usuario:usuarioId  //en caso de que otro usuario diferente al que lo creo lo esté actualizando. 
    };
    const hospitalActualizado=await Hospital.findByIdAndUpdate(hospitalId, cambiosHospital, {new:true});

    res.json({
      ok:true, 
      msg:'ActualizarHospital',
      hospital:hospitalActualizado
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

const borrarHospital = async (req, res=response)=>{
  const hospitalId=req.params.id;

  try {

    const hospitalDB=await Hospital.findById(hospitalId);

    if(!hospitalDB){
      return res.json({
        ok:false, 
        msg:"Hospital no encontrado por id"
      });
    }

    await Hospital.findByIdAndDelete(hospitalId);

    res.json({
      ok:true, 
      msg:'Hospital eliminado'
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


module.exports={
  getHospital, 
  crearHospital, 
  borrarHospital, 
  actualizarHospital
};