const { response } = require("express");
const Hospital = require("../models/hospital");
const Medico = require("../models/medico");
const Usuario = require("../models/usuario");

const getTodo = async (req, res = response) => {
  const bus = req.params.param;
  const regex = new RegExp(bus, "i");

  const [usuarios, medicos, hospitales] = await Promise.all([
    Usuario.find({ nombre: regex }),
    Medico.find({ nombre: regex }),
    Hospital.find({ nombre: regex })
  ]);

  res.json({
    ok: true,
    usuarios,
    medicos, 
    hospitales
  });
};

const getDocumentosColeccion = async (req, res = response) => {
  const tabla = req.params.tabla;
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, "i");

  let data=[];

  switch (tabla) {
    case 'medicos':
      data = await Medico.find({nombre:regex})
                         .populate('usuario','nombre img')
                         .populate('hospital','nombre img');
    break;

    case 'hospitales':
      data = await (await Hospital.find({nombre:regex}));
                                  
    break;

    case 'usuarios':
      data = await Usuario.find({nombre:regex});
    break;

    default:
      return res.status(400).json({
        ok:false, 
        msg:'La tabla tiene que ser un usuarios/medicos/hospitales'
      });
  }

  res.json({
    ok:true,
    resultados:data
  });

  

  const [usuarios, medicos, hospitales] = await Promise.all([
    Usuario.find({ nombre: regex }),
    Medico.find({ nombre: regex }),
    Hospital.find({ nombre: regex })
  ]);

  res.json({
    ok: true,
    usuarios,
    medicos, 
    hospitales
  });
};



module.exports = {
  getTodo,
  getDocumentosColeccion
};
