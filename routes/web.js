const HomeController=require("../app/http/controllers/HomeController");
const authController=require("../app/http/controllers/authController");
const CartController=require("../app/http/controllers/customers/CartController");
function InitRoutes(app){
    app.get("/",HomeController().index);
    
    app.get("/cart",CartController().Cart);
    
    app.get("/login",authController().login);
    
    app.get("/register",authController().register);
    
};

module.exports=InitRoutes;