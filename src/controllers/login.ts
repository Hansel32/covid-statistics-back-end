import { Request, Response, NextFunction } from "express";
import { User, UserDocument, AuthToken } from "../models/User";
import passport from "passport";
import "../config/passport";

/**
 * Sign in using email and password.
 * @route POST /login
 */
export const postLogin = async (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate("local", (err: Error, user: UserDocument) => {
        if (err) { return next(err); }
        if (!user) {
            console.log("error: " + user)
            return res.status(401).send('failed');
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            res.status(200).send('Success');
        });
    })(req, res, next);
};

/**
 * Create a new local account.
 * @route POST /signup
 */
export const postSignup = async (req: Request, res: Response, next: NextFunction) => {

    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            req.flash("errors", "Account with that email address already exists.");
            return res.redirect("/register");
        }
        user.save((err) => {
            if (err) { return next(err); }
            console.log("before req.login");
            res.status(200).send('Success');
        });
    });
};
