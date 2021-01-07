const express=require("express");
const app=express();
const ejs=require('ejs');
const path=require('path');
const expressLayouts=require("express-ejs-layouts");


const PORT= process.env.PORT || 3000;

// setting ejs template engine
app.use(expressLayouts);
app.set("views",path.join(__dirname,"/resources/views"));
app.set("view engine","ejs");

// setting static path
app.use(express.static('public'));

app.get("/",(req,res)=>{
    res.render("home")
});

app.get("/cart",(req,res)=>{
    res.render("customers/cart")
});

app.get("/login",(req,res)=>{
    res.render("auth/login")
});

app.get("/register",(req,res)=>{
    res.render("auth/register")
});


app.listen(PORT,()=>{
    console.log(`The Server run at Port:${PORT}`);
})