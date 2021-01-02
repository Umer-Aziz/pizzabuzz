const express=require("express");
const app=express();
const ejs=require('ejs');
const path=require('path');
const expressLayouts=require("express-ejs-layouts");

//seting port.
const PORT= process.env.PORT || 3000;
// setting static path

app.use(express.static('public'))
app.get("/",(req,res)=>{
    res.render("home")
})
// setting ejs template engine
app.use(expressLayouts);
app.set("views",path.join(__dirname,"/resources/views"));
app.set("view engine","ejs");

app.listen(PORT,()=>{
    console.log(`The Server run at Port:${PORT}`);
})