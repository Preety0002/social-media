var express = require('express');
var router = express.Router();
const user=require("../models/userschema")


const upload = require("../utils/multer").single("profilepic");
const fs = require("fs");
const path = require("path");

const sendmail = require("../utils/mail");



const passport=require("passport")
const LocalStrategy=require("passport-local")

passport.use(new LocalStrategy(user.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user:req.user });  
});

router.get('/login', function(req, res, next) {
  res.render("login", { user:req.user });
});

router.get('/update-user/:id', function(req, res, next) {
  res.render("updateuser", { user:req.user });
});

router.get('/reset-password/:id',isLoggedIn, function(req, res, next) {
  res.render("resetpassword", { user:req.user });
});

router.post("/reset-password/:id", isLoggedIn, async function (req, res, next) {
  try {
      await req.user.changePassword(
          req.body.oldpassword,
          req.body.newpassword
      );
      req.user.save();
      res.redirect(`/update-user/${req.user._id}`);
  } catch (error) {
      res.send(error);
  }
});






router.post("/login-user",
  passport.authenticate("local",{
    successRedirect:"/profile",
    failureRedirect:"/login",
  }),
  function(req,res,next){}
);

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    next() 
  }
  else{
    res.redirect("/login")
  }
}
router.get("/logout-user",function(req,res,next){
  req.logout(()=>{
    res.redirect("/login")
  })
})



router.get('/about', function(req, res, next) {
  res.render("about", { user:req.user });
});

router.get('/profile', function(req, res, next) {
  res.render("profile", { user:req.user });
});
router.get("/delete-user/:id",isLoggedIn,async function(req,res,next){
  try{
    const deleteuser=await user.findByIdAndDelete(req.params.id);

    if (deleteuser.profilepic !== "default.png") {
      fs.unlinkSync(
          path.join(
              __dirname,
              "..",
              "public",
              "images",
              deleteuser.profilepic 
          )
      );
  }

    res.redirect("/login");

  }
  catch(error){
    res.send(error)
  }
})
 
router.get('/register', function(req, res, next) {
  res.render("register", { user:req.user });
});


router.get("/forget-email", function (req, res, next) {
  res.render("userforgetemail", { user: req.user });
});

router.post("/forget-email", async function (req, res, next) {
  try {
      const User = await user.findOne({ email: req.body.email });

      if (User) {
         const url = `${req.protocol}://${req.get("host")}/forget-password/${
          User._id
       }`
      sendmail(res, User,url);
           
      }
       else {
          res.redirect("/forget-email");
      }
  } catch (error) {
      res.send(error);
  }
});



router.get("/forgot-password/:id", function (req, res, next) {
  res.render("forgotpassword", { user: req.user, id: req.params.id });
});

router.post("/forgot-password/:id", async function (req, res, next) {
  // try {
  //     const User = await user.findById(req.params.id);
  //     await User.setPassword(req.body.password);
  //     await User.save();
  //     res.redirect("/login");

      try {
        const User = await user.findById(req.params.id);
        if (User.resetPasswordToken == 1) {
            await User.setPassword(req.body.password);
            User.resetPasswordToken = 0;
            await User.save();
            res.redirect("/login");
        } else {
            res.send("Link Expired Try Again!");
        }
        

  } catch (error) {
      res.send(error);
  }
});


router.post("/register-user", async function (req, res, next) {
  try {
      const { username, email, name, password } = req.body;
      await user.register({ name, username, email }, password);
      res.redirect("/login");
  } catch (error) {
      res.send(error);
  }
});

router.post("/image/:id", isLoggedIn, upload, async function (req, res, next) {
  try {
      if (req.user.profilepic !== "default.png") {
          fs.unlinkSync(
              path.join(
                  __dirname,
                  "..",
                  "public",
                  "images",
                  req.user.profilepic
              )
          );
      }
      req.user.profilepic = req.file.filename;
      await req.user.save();
      res.redirect(`/update-user/${req.params.id}`);
  } catch (error) {
      res.send(err);
  }
});


module.exports = router;
