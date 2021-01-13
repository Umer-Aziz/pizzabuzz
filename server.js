const express=require("express");
const app=express();
const ejs=require('ejs');
const path=require('path');
const expressLayouts=require("express-ejs-layouts");
const PORT= process.env.PORT || 3000;

const mongoose=require("mongoose");

// setting database

mongoose.connect("mongodb://localhost:27017/pizza",{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true, 
    useFindAndModify:true
    
});
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log("Database Connected Successfully...");

}).catch(err =>{
    console.log("connection failed..")
});

// setting ejs template engine
app.use(expressLayouts);
app.set("views",path.join(__dirname,"/resources/views"));
app.set("view engine","ejs");

// setting static path
app.use(express.static('public'));


// setting routes
require("./routes/web")(app);

app.listen(PORT,()=>{
    console.log(`The Server run at Port:${PORT}`);
})