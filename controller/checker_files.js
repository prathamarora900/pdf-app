const c=require("cookie-parser");
module.exports= checker_files=(req,res,next)=>{
   try{

    if(req.cookies.name==" " && req.cookies.rollno==" "){
        return res.redirect("/");
    }
    else{
        next();
    }
   }catch(err){
       console.log(err);
      return  res.send("there is some error");
   }
}
