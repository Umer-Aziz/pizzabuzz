const Menu =require("../../models/Menu")
function HomeController(){
    return{
       async index(req,res){  
           
        const pizzas=await Menu.find();
        // console.log(pizzas)
        res.render("home",{pizzas:pizzas});

        }
    }
}

module.exports=HomeController;