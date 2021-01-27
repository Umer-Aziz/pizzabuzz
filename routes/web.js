const HomeController=require("../app/http/controllers/HomeController");
const authController=require("../app/http/controllers/authController");
const CartController=require("../app/http/controllers/customers/CartController");
const OrderController=require("../app/http/controllers/customers/OrderController");
const AdminOrderController=require("../app/http/controllers/admin/orderController");

//middlewares route
const guest=require("../app/http/middleware/guest");
const authen=require("../app/http/middleware/authen");
const admin=require("../app/http/middleware/admin");


function InitRoutes(app){
    app.get("/",HomeController().index);
    
    app.get("/login",guest,authController().login);
    
    app.post("/login",authController().postLogin);
    
    app.post("/logout",authController().logout);
    
    app.get("/register",guest,authController().register);

    app.post("/register",authController().Postregister);

    app.get("/cart",CartController().Cart);
    
    app.post("/update-cart",CartController().update);


    // Customer Route
    app.post("/Orders",authen,OrderController().store);
    app.get("/customer/orders",authen,OrderController().GetStore)
    

    //admin routes
   
    app.get("/admin/orders",admin,AdminOrderController().index)

};

module.exports=InitRoutes;