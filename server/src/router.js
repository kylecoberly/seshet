module.exports = function(app){
    [
        "profiles",
    ].forEach(route => {
        app.use(`/${route}`, require(`./routes/${route}`)(app));
    });

    return app;
}

