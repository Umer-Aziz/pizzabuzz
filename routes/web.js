const HomeController=require("../app/http/controllers/HomeController");
const authController=require("../app/http/controllers/authController");
const CartController=require("../app/http/controllers/customers/CartController");
function InitRoutes(app){
    app.get("/",HomeController().index);
    
    app.get("/login",authController().login);
    
    app.get("/register",authController().register);

    app.get("/cart",CartController().Cart);
    
    app.post("/update-cart",CartController().update);
    
};

module.exports=InitRoutes;