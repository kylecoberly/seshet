const Profile = require("../models/profile");
const { generateToken } = require("../utilities/auth");

function create(request, response, next){
    const fullProfile = Profile.add(request.body, true)
        .then(fullProfile => {
            const token = generateToken(fullProfile);
            Profile.find(fullProfile.id, false).then(profile => {
                response.status(201).json({
                    data: profile,
                    jwt: token,
                });
            });
        }).catch(error => next(error));
}

function read(request, response, next){
    Profile.find(request.params.id)
        .then(profiles => {
            response.status(200).json({
                data: profiles
            });
        }).catch(error => next(error));
}

function update(request, response, next){
    Profile.update(request.params.id, request.body)
        .then(profile => {
            response.status(200).json({
                data: profile
            });
        }).catch(error => next(error));
}

function destroy(request, response, next){
    Profile.remove(request.params.id)
        .then(() => {
            response.status(204).send();
        }).catch(error => next(error));
}

function list(request, response, next){
    Profile.list()
        .then(profiles => {
            response.status(200).json({
                data: profiles
            });
        }).catch(error => next(error));
}

function isEmailUnique(request, response, next){
    Profile.query({email: request.body.email})
        .then(profile => {
            const status = !profile
                ? 200
                : 400;
            response.status(status).send();
        }).catch(error => next(error));
}

module.exports = {
    create,
    read,
    update,
    destroy,
    list,
    isEmailUnique,
};

