module.exports = function(app){
    app.use(function(request, response, next) {
        const error = new Error("Not Found");
        error.status = 404;
        next(error);
    });

    app.use(function(error, request, response, next) {
        console.error(error);
        response.locals.message = error.message;
        response.locals.error = request.app.get("env") === "development" ? error : {};

        if (error.message === "Incorrect password"){
            error.status = 401;
        }
        response.status(error.status || 500).send({error: error.message});
    });

    return app;
}

