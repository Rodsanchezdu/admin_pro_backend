const mongoose=require('mongoose'); 

const dbConnection=async ()=>{

  try {
    await mongoose.connect(process.env.CADENA_DE_CONEXION, {
            useNewUrlParser: true, 
            useUnifiedTopology: true});
    console.log('DB online');
    
  } catch (error) {
    console.log(error);
    throw new Error('Eror a la hora de inicar la DB')
    
  }
  
}

module.exports={
  dbConnection
}