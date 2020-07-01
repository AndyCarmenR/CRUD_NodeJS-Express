var express=require("express");
var router=express.Router();
var Imagen=require("./models/imagenes");
var find_image=require("./middleware/find_image");
var formidable= require("express-formidable");
var fs=require("fs");



router.get("/",function(req,res){
    Imagen.find({})
    .populate("creador")
    .exec(function(err,imagenes){
        if(err) console.log(err);
        res.render("app/home",{imagenes:imagenes});
    })
    
});

//SERVICIOS REST

router.all("/imagenes/:id*",find_image);

router.get("/imagenes_new",function(req,res){
    res.render("app/imagenes/new");
});

router.get("/imagenes/:id/edit",function(req,res){
    res.render("app/imagenes/edit");
});

router.route("/imagenes/:id")
    .get(function(req,res){
        res.render("app/imagenes/show");
    })
    .put(function(req,res){
        res.locals.imagen.titulo=req.body.titulo;            
            res.locals.imagen.save(function(err){
                if (!err) {
                    res.render("app/imagenes/show");                    
                } else {
                    res.render("app/imagenes/"+req.params.id+"edit");
                }
            });
    })
    .delete(function(req,res){
        Imagen.findOneAndRemove({_id: req.params.id},function(err){
            if (!err) {
                res.redirect("/app/imagenes");
            } else {
                console.log(err);
                res.redirect("/app/imagenes/"+req.params.id);
            }
        });
    });


    router.route("/imagenes",)
    .get(function(req,res){
        Imagen.find({creador: res.locals.user._id},function(err,imagenes){
            if (err) {
                res.redirect("/app");
                return;
            }
            res.render("app/imagenes/index",{imagenes:imagenes});
        });
    })
    .post(formidable(), function(req,res){
        //console.log(req.files.archivo)
        var extension=req.files.archivo.name.split(".").pop();
        var data={
            titulo:req.fields.titulo,
            creador:res.locals.user._id,
            extension: extension
        };
        var imagen=new Imagen(data);        
        imagen.save(function(err){
            if (!err) {                
                fs.rename(req.files.archivo.path, "public/imagenes/"+imagen._id+"."+extension,function(){});
                res.redirect("/app/imagenes/"+imagen._id);
            }
            else{
                console.log(err)
                res.redirect("/app")
            }
        })
    });
module.exports=router;