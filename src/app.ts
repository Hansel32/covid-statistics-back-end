import express from "express";
import bodyParser from "body-parser";
import * as loginController from "./controllers/login";
import * as dashboardController from "./controllers/dashboard";
import flash from "express-flash";
import passport from "passport";
import session from "express-session";
import {SESSION_SECRET} from "./util/secrets";
import mongo from "connect-mongo";
import cookieParser from "cookie-parser"

// API keys and Passport configuration
import * as passportConfig from "./config/passport";

const MongoStore = mongo(session);

// Create Express server
const app = express();

app.set("port", process.env.PORT || 3000);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use( session({
    cookie: {secure: false, httpOnly:  false},
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
        url: "mongodb+srv://cstatistics1:FXOwh7eTWBtetXSF@cluster0.jmlqr.mongodb.net/test1?retryWrites=true&w=majority",
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
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Allow-Origin-With-Credentials', 'true');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// app.get("/", homeController.index);
app.post("/login", loginController.postLogin);
app.post("/logout", loginController.postLogOut);
app.post("/register", loginController.postSignup);
app.get("/dashboard", passportConfig.isAuthenticated, dashboardController.getDashboard);
app.get("/dashboard/country/:id", passportConfig.isAuthenticated, dashboardController.getCountry);
app.get("/sync", passportConfig.isAuthenticated,dashboardController.getSyncApi);
// app.post("/login", userController.postLogin);

export default app;

