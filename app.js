const express=require("express")
const app=express()
app.set("view engine","ejs")
app.use(express.static("public"))
const bodyparser=require("body-parser")
app.use(bodyparser.urlencoded({extended:true}))
const methodOverride= require("method-override")
app.use(methodOverride("method"))
const flash=require("connect-flash")
app.use(flash())
app.locals.moment = require('moment');
require('dotenv').config()

//+++++++++++++ mongoose connection ++++++++++++
var mongoose=require("mongoose")
mongoose.connect("mongodb+srv://kulkarnisiddhesh29:siddhesh27@art-united.c7hsw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false,useCreateIndex:true},function(err){
    if(err){
        console.log("cannot connect to database")
    }
});

//++++++++++++ Passport initilize ++++++++++++++++++++
const passport=require("passport")
const localStratagy=require("passport-local")
const expressSessions=require("express-session")

app.use(expressSessions({
    secret:"siddhesh kulkarni is best",
    resave: false,
    saveUninitialized :false
}))
app.use(passport.initialize())
app.use(passport.session())

//+++++++++++++ Models +++++++++++++++++++++++++++
const user=require("./models/user")


//++++++++++++ Passport use ++++++++++++++++++++
passport.use(new localStratagy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error=req.flash("error")
    res.locals.success= req.flash("success")
    next();
 });


 //+++++++++++++++ Routes +++++++++++++++++++++
const userRoutes=require("./routes/index")
const campRoutes=require("./routes/campground")
const commentRoutes=require("./routes/comments")

app.use(userRoutes)
app.use(campRoutes)
app.use(commentRoutes)

//++++++++++++ Listening port +++++++++++++++++++
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
