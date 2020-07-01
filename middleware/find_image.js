var Imagen = require("../models/imagenes");
var validate_owner=require("./image_permisions");

module.exports = function (req, res, next) {
    Imagen.findById(req.params.id)
        .populate("creador")
        .exec(function (err, imagen) {
            if (imagen != null && validate_owner(imagen,req,res)) {
                //console.log("imagen encontrada " + imagen)
                res.locals.imagen = imagen;
                next();
            } else {
                console.log(err)
                res.redirect("/app")
            }
        });
}