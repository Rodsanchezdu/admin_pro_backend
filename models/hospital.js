const {Schema, model}= require('mongoose');

const HospitalSchema =Schema({
  nombre:{
    type:String, 
    required:true

  }, 
  img:{
    type:String

  }, 
  usuario:{
    required:true,
    type:Schema.Types.ObjectId,
    ref:'Usuario'
  }
},{collection:'hospitales'}); 

//afectación visual no cambia nada en la DB
HospitalSchema.method('toJSON', function(){
  const {_v, _id,...object}=this.toObject();
  object.id=_id; 
  return object;
});

module.exports=model('Hospital', HospitalSchema);