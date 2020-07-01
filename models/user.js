var mongoose=require("mongoose");
var schema=mongoose.Schema;

mongoose.connect("mongodb://localhost/fotos",{useNewUrlParser: true, useUnifiedTopology: true});

var posiblesValores=["M","F"];
var email_regexp=[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Coloca un email válido."]

var user_Schema=new schema({
    name:String,
    userName:{type:String, required:true, maxlength:[50,"Username muy largo"],minlength:[8,"Username muy corto"]},
    age:{type:Number, min:[5,"La edad no puede ser menor que 5"]},
    password:{type:String, minlength:[8,"El password es muy corto"], 
    validate:{
        validator:function(p){
            return this.password_confirmation==p;
        },
        message:"Las contraseñas no son iguales."
    }},
    email:{type:String,required:"El correo es obligatorio",match:email_regexp},
    date_of_birth:Date,
    sex:{type:String, enum:{values:posiblesValores, message:"Opción no válida."}}
});
user_Schema.virtual("password_confirmation").get(function(){
    return this.p_c;
}).set(function(password){
    this.p_c=password;
});
var User=mongoose.model("User",user_Schema);
module.exports.User=User;
