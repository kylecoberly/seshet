const Model = require("./model");

const { hashPassword } = require("../utilities/auth");

class Profile extends Model {
    constructor(){
        super("profile");
        this.publicProperties = [
            "id", "first_name", "last_name", "email", "profile_photo_url",
            "bio", "employer", "position", "website", "linkedin_username",
            "github_username", "twitter_username", "role", "ticket_level",
            "is_self_employed",
        ];
    }
    async add(item, isAdmin){
        const { secretKey, hashedPassword } = await hashPassword(item.password)
            .catch(error => {
                throw new Error(error.message);
            });
        delete item.password;
        item.email = item.email.toLowerCase();
        item = Object.assign(item, {
            secret_key: secretKey,
            hashed_password: hashedPassword,
            role: "attendee",
        });
        return this.database(this.modelName)
            .returning(this.propertyList(isAdmin))
            .insert(item)
            .then(items => items[0])
            .catch(error => {
                throw new Error(error.message);
            });
    }
}

module.exports = new Profile();

