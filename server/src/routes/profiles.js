const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
    create, read, update, destroy, list, isEmailUnique,
} = require("../controllers/profile");

function isOwner(request, response, next) {
    if (request.user.id == request.params.id) {
        next();
    } else {
        const error = new Error("Quit it.");
        next(error);
    }
};

module.exports = (app) => {
    router.get("/", list);
    router.post("/email", isEmailUnique);
    router.get("/:id", read);
    router.post("/", create);
    router.use(passport.authenticate("jwt", { session: false }));
    router.put("/:id", isOwner, update);
    router.delete("/:id", isOwner, destroy);

    return router;
};

