var mongoose=require("mongoose");
var schema=mongoose.Schema;

mongoose.connect("mongodb://localhost/fotos",{useNewUrlParser: true, useUnifiedTopology: true});

var img_schema=new schema({
    titulo:{type:String,required:true},
    creador:{type: mongoose.Schema.Types.ObjectId,ref:"User"},
    extension:{type:String,required:true}
});
var imagen=mongoose.model("Imagen",img_schema);

module.exports=imagen;