const User=require("../../models/User");
const bcrypt=require("bcrypt");
const passport=require('passport');
function authController(){
    const _getRedirectUrl=(req) =>{
        return req.user.role ==='admin'?'/admin/orders':'/customer/orders'
    }
    return{
        login(req,res){
         res.render("auth/login")           
        },
         postLogin(req,res,next){
       
            const {email,password}=req.body;
            //validation request.
            if(!email || !password){
                req.flash("error","All Fields are required !");
                return res.redirect("/login");
            }
       

             passport.authenticate('local',(err,user,info)=>{
          if(err){
           req.flash('error',info.message)
            return next(err)

        }
        if(!user){
            req.flash('error',info.message)
            return res.redirect("/login")
        }
        req.login(user,(err)=>{
            if(err){
                req.flash('error',info.message)
                return next(err)

            }
            return res.redirect(_getRedirectUrl(req));
        })
   })(req,res,next)

         },

        register(req,res){      

                res.render("auth/register");
    
        },
     async Postregister(req,res){
         const {name,email,password} =req.body;
         
         //validate request      
        if( !name){
             req.flash("name","Please Enter Your Name.");
             req.flash("Name",name);
            req.flash("Email",email);
             return res.redirect("/register");
         }
          if( !email){
             req.flash("email","Please Enter Your Email.");
             req.flash("Name",name);
             req.flash("Email",email);
             return res.redirect("/register");
         }
        if( !password){
             req.flash("password","Please Enter Your Password.");
             req.flash("Name",name);
             req.flash("Email",email);
             return res.redirect("/register");
             
         }
         //if Email exist
         User.exists({email: email},(err,result)=>{
             if(result){
                 req.flash("email","Email is already taken");
                 req.flash("Name",name);
                 req.flash("Email",email);
                 return res.redirect("/register");
             }
         })
         //encryption of password
const HasedPassword=await bcrypt.hash(password,10)
         //Create user in databse
         const user=new User({
             name,
             email,
             password:HasedPassword
         })
         user.save().then(()=>{
           //Login user

           return res.redirect("/");
         }).catch(err =>{
          req.flash("error",'Something Went Wrong !');
          return res.redirect("/register");
         })
        
        },
        logout(req,res){
            req.logout()
            return res.redirect("/login");
        }
    }
}
module.exports=authController;