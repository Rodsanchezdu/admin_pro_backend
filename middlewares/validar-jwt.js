const jwt =require('jsonwebtoken');


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

module.exports={
  validarJWT
};