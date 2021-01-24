const HomeController=require("../app/http/controllers/HomeController");
const authController=require("../app/http/controllers/authController");
const CartController=require("../app/http/controllers/customers/CartController");

const guest=require("../app/http/middleware/guest")

function InitRoutes(app){
    app.get("/",HomeController().index);
    
    app.get("/login",guest,authController().login);
    
    app.post("/login",authController().postLogin);
    
    app.post("/logout",authController().logout);
    
    app.get("/register",guest,authController().register);

    app.post("/register",authController().Postregister);

    app.get("/cart",CartController().Cart);
    
    app.post("/update-cart",CartController().update);
    
};

module.exports=InitRoutes;