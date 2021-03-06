const express = require('express');
const app = express();

const hbs    = require("hbs");
const path   = require("path");

const session     = require("express-session");
// const redis       = require("redis");
// const redisStore  = require("connect-redis")(session);
// const redisClient = redis.createClient();


const bodyParser   = require("body-parser");



const dramasRouter = require("./router/dramas");
const aboutRouter  = require("./router/about");


// 設定模板引擎
app.engine('html',hbs.__express);

// 設定模板 位置
app.set("views" , path.join(__dirname ,"application","views"));

// 設定靜態檔 位置
app.use(express.static(path.join(__dirname,"application")));


// Setting body-parser
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
		extended : false ,
		limit : "1mb",
		parameterLimit : '10000'
}));


// Use Session
app.use(session({
    // store : new redisStore({ client: redisClient}),
    secret : "c90dis90#" ,
    resave : true,
    saveUninitialized : false,
    name:"_ntust_tutorial_id",
    ttl : 24*60*60*1
}))




app.get("/login",(req,res)=>{
    res.render("login.html");
});

let isAccountExist = (req,res,next)=>{
    // do something ...
    next();
};

let isPasswdExist = (req,res,next)=>{
    // do something ...
    next();
};


let isUserValid = (req,res,next)=>{
    let account = req.body.account; 
    let passwd  = req.body.passwd;
    if(account === "jeff" && passwd === "testqq"){
        req.isLoginedValid = true;
    }
    else {
        req.isLoginedValid = false;
    };


    if(!req.isLoginedValid){
        res.status(400).json({message:"帳號或密碼錯誤！"});
        return;
    };

    next();
};

let setUserInfo = (req,res,next)=>{
    if(req.isLoginedValid){
        req.session.userInfo = {
            name : "測試人" , 
            age  : 18 ,
            isLogined : true
        };
    }else{
        req.session.userInfo = { isLogined: false };
    };

    next();
};


app.post("/auth",
  isAccountExist,
  isPasswdExist,
  isUserValid,
  setUserInfo,
  (req,res,next)=>{
     res.json({
       message  : "ok.",
       redirect : "/"
     });
  }
);


app.use("/about",aboutRouter);
app.use("/dramas",dramasRouter);



app.get("/logout",(req,res)=>{
    req.session.destroy();
    res.clearCookie("_ntust_tutorial_id");
    res.redirect("/login");
});



app.get("/",
    (req,res,next)=>{
        if(!req.session.userInfo || !req.session.userInfo.isLogined){
            res.redirect("/login");
            return;
        };
        next();
    },
    (req,res)=>{
        res.render("index.html");
    }
);



app.listen(8088,function(){
    console.log("Server is running at http://localhost:" + String(8088));
});



