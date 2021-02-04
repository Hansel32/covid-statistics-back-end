import express from "express";
import bodyParser from "body-parser";
import * as loginController from "./controllers/login";
import flash from "express-flash";
import passport from "passport";
import session from "express-session";
import {SESSION_SECRET} from "./util/secrets";
import mongo from "connect-mongo";

const MongoStore = mongo(session);

// Create Express server
const app = express();

app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use( session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
        url: "mongodb+srv://cstatistics1:FXOwh7eTWBtetXSF@cluster0.jmlqr.mongodb.net/test?retryWrites=true&w=majority",
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,
         res,
         next) => {
    res.locals.user = req.user;
    next();
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// app.get("/", homeController.index);
app.post("/login", loginController.postLogin);
app.post("/register", loginController.postSignup);
// app.post("/login", userController.postLogin);

export default app;
