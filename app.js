var express = require("express");
var bodyParser = require("body-parser");
//var multer=require("multer");
//var upload=multer();
var User = require("./models/user").User;
var cookieSession = require("cookie-session");
var router_app = require("./routes_app");
var session_middleware = require("./middleware/sessions");
var methodOverride = require("method-override");
var formidable = require("express-formidable");
const imagen = require("./models/imagenes");


var app = express();


app.use(methodOverride("_method"));
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//app.use(upload.array()); 
app.use(cookieSession({
    name: "session",
    keys: ["llave1", "llave2"]
}));
//app.use(formidable({multiples: true}));

app.set("view engine", "jade");




app.get("/", function (req, res) {
    console.log(req.session.user_id);
    res.render("index");
});
app.get("/login", function (req, res) {
    Imagen.find({})
        .populate("creador")
        .exec(function (err, imagenes) {
            if (err) console.log(err);
            res.render("login");
        });

});

app.get("/signUp", function (req, res) {
    User.find(function (err, doc) {
        console.log(doc);
        res.render("signUp");
    })
});

app.post("/users", function (req, res) {
    // console.log("email: "+req.body.email);
    //console.log("contraseña: "+req.body.password);
    var user = new User({
        email: req.body.email,
        password: req.body.password,
        password_confirmation: req.body.password_confirmation,
        userName: req.body.userName
    });

    user.save().then(function (user) {
        User.find(function (err, doc) {
            console.log(doc)
            res.send("Guardamos exitosamente la información.")
        })

    }, function (err) {
        if (err) {
            console.log(String(err));
            res.send("Hubo un problema al guardar la información")
        }
    });

});
app.post("/sessions", function (req, res) {
    User.findOne({ email: req.body.email, password: req.body.password }, function (err, user) {
        req.session.user_id = user._id;
        res.redirect("/app");
    });

});

app.use("/app", session_middleware);
app.use("/app", router_app);

app.listen(8010);