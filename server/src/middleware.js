module.exports = (app) => {
    if (["development", "production"].includes(process.env.NODE_ENV)){
        app.use(require("morgan")("dev"));
    }
    app.use(require("helmet")());
    const bodyParser = require("body-parser");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(require("cors")());
    app.use(require("cookie-parser")());

    return app;
};

