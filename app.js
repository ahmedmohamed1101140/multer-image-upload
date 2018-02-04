var express = require("express");
var ejs     = require("ejs");
var multer  = require("multer");
var path    = require("path");

//set Storage Engin
const Storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req,file,cb){
        cb(null , file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


//init the uplad
const upload = multer({
    storage: Storage,
    limits:{fileSize: 10000000},
    fileFilter: function(req , file , cb){
        chech_file_type(file,cb);
    }
}).single('my-image');

//chech file type
function chech_file_type(file, cb){
    // Allowd Extentions
    const FileType = /jpeg|jpg|png|gif/;
    //check the extentions
    const extname = FileType.test(path.extname(file.originalname).toLowerCase());
    //check the mime type
    const mimiType = FileType.test(file.mimetype);

    if(mimiType&&extname){
        return cb(null,true);
    }
    else{
        cb("Error: Images Only!");
    }
}



//init the application
var app = express();

//set the engin view to ejs
app.set("view engine",'ejs');

//make static folder to hold uploads files and css
app.use(express.static('./public'));


app.post("/uploads", function(req,res){
    upload(req,res,function(err){
        if(err){
            console.log(err);
            res.render('index',{msg:err});
        }
        else{
           if(req.file == undefined){
               res.render('index',{msg: 'Error: No File Selected!'});
           }
           else{
               res.render('index',{msg:"Success: File Uploaded!",file: `uploads/${req.file.filename}`})
           }
        }
    });
});


app.get("/",function(req,res){
    res.render('index');
});


//start the server
app.listen(process.env.PORT,function(err){
    console.log("server Running at Port: "+process.env.PORT);
});