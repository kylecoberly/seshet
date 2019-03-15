require("dotenv").load();

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJwt = require("passport-jwt");
const JWTStrategy = passportJwt.Strategy;
const bcrypt = require("bcrypt");
const profile = require("../models/profile");
const { decodeJwt } = require("../utilities/auth");

passport.use(new LocalStrategy({ session: false }, verifyLogin));
passport.use(new JWTStrategy({
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKeyProvider: secretProvider,
}, verifyAccess));

async function secretProvider(request, rawJwt, next){
    if (!rawJwt) {
        next(new Error("Missing JWT"));
    }
    const { sub } = decodeJwt(rawJwt);
    const user = await profile.find(sub, true)
        .catch(error => next(error));
    next(null, user.secret_key);
}

async function verifyLogin(username, password, next){
    const user = await profile.query({ email: username }, true)
        .catch(error => next(error));
    if (!user) {
        next(new Error("No matching user"))
    }
    const isMatchingPassword = await bcrypt
        .compare(password, user.hashed_password)
        .catch(error => next(error));
    isMatchingPassword
        ? next(null, user)
        : next(new Error("Incorrect password"), false);
}

async function verifyAccess(payload, next){
    const user = await profile.find(payload.sub, true)
        .catch(error => next(error));
    return payload.sub
        ? next(null, user, payload)
        : next(new Error("Unauthorized"));
}

module.exports = (app) => {
    app.use(passport.initialize())
    return app;
};

