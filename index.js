const express=require("express");
const hbs=require("hbs");            //handlebars                                   //require all module that we use
const path=require("path"); 
const nodemailer=require("nodemailer");   
const prompt=require("prompt"); 
const checker_files=require("./controller/checker_files");    
//const { DownloaderHelper } = require('node-downloader-helper');     
//const  download=require("download"); 
const  fs=require("fs");        //file system
//const pdf_convert=require("images-to-pdf");   //converter
const rimraf=require("rimraf");   //for deleting non empty files
let PDFDocument = require('pdfkit');    //for creating pdf
const port=process.env.PORT||3000;
const app=express();
const fileUpload=require("express-fileupload");    //file uploader
const cp=require("cookie-parser");
app.set("view-engine","hbs");
app.use(cp());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },   //set file size that you are uploading
}));
app.get("/",(req,res)=>{
 
  res.cookie("email","");
  res.cookie("total_files","");
    res.render("index.hbs");   //rendering index page
    })
app.post("/upload",async(req,res)=>{
    try{
       
//make file and upload image in that  
  console.log("cokkies"+" "+req.cookies.total_files);
const total_files=req.cookies.total_files;
 if(fs.existsSync(path.join(__dirname, 'up'))){    //if folder exits it will delete it
    //rimraf("./up", function () {    //async
        ///console.log("done");
      
    //});
    rimraf.sync("./up");
  }
  
  fs.mkdir(path.join(__dirname, 'up'), (err) => {   //making dir
    if (err) {
        //res.send("network issue");  //some error occur
    }
    console.log('Directory created successfully!');  //succesfully created
});
let decision=false;   //set decision intialize as false for stoping from 2 rendering
let count=0;       //count the occurance
let arr=[];
//console.log(filename);
//console.log(req.files.file);
let file=  req.files.file.name;
//console.log(filename);
console.log(file);

if(total_files==1){
req.files.file.mv("./up/"+file,function(err){  //move uploaded files to aim directory
    if(err){
    }else{
        console.log("okay");
    }
})
}
else if(total_files>1){
req.files.file.map((e,value) => {    //map helps us for giving value or index in array or object of array 
    console.log("okay");
    //map all objects
let filename=req.files.file[value].name;
req.files.file[value].mv(    //mv input file to upload folder
    './up/'+filename,function (err){
        if(err){
            decision=false;

        }else{    
        arr[count]=`${filename}`;
        count++;
        decision=true;
        console.log("ajjh"+arr);
       // res.send("okay");
        }})})}

   
       




   res.redirect("/pdf");

//res.send("okay");
    }
    catch(err){
        console.log(err);
        res.send("err");
    }
})
    

app.get("/pdf",async(req,res)=>{
    try{   
         /* let image_array=[];
        let c=0;
let testFolder="./up/";
        fs.readdirSync(testFolder).forEach(file => {  //it will read the files > directories
            console.log(file);
            image_array[c]=file;
            c++;
          });
          console.log(image_array);
        let doc = new PDFDocument;

        doc.pipe(fs.createWriteStream("output.pdf"))
        doc.moveTo(0,0);
        image_array.map((current_image,value) =>{
            doc.image("./up/"+current_image, {
               fit: [600,600],
                align: 'left',
                valign: 'center'
             });
             if(value<image_array.length-1){          
               doc.addPage();
               console.log(value);
              }
             
               
              
             
            
        })
        doc.end();
       
        
      res.redirect("/prompt");
     

  
  //Pipe its output somewhere, like to a file or HTTP response 
  //See below for browser usage 
 

  //Add an image, constrain it to a given size, and center it vertically and horizontally 

*/
  }
     catch(err){
         console.log(err);
     }
})
app.get("/prompt",(req,res)=>{
    res.render('prompt.hbs');
})
app.get("/send",(req,res)=>{
    //download

    
    console.log(req.cookies.email);
    let email=req.cookies.email;
    if(!email){
  console.log("error");
  res.redirect("/");
    }
    var transporter = nodemailer.createTransport({   //creating a transport  //smtp
        service: 'gmail',
        auth: {
          user: 'arorapratham900@gmail.com',
          pass: 'prathamarora1'
        }
      });
      
      var mailOptions = {   //mail option
        from: 'arorapratham900@gmail.com',
        to: `${email}`,
        subject: 'Sending Email using Node.js',
        text: "",
        attachments:[{
          filename: 'output.pdf',
          path: __dirname + '/output.pdf'
        }]
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          
          res.cookie("email","");
          res.cookie("total_files","");
          res.send("error");
        } else {
          console.log('Email sent: ' + info.response);
          res.send("okay");
          res.cookie("email","");
          res.cookie("total_files","");

        }
      });
    
    });


app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})
//window.location.href