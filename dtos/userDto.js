module.exports = class UserDto {
    email;
    id; 
    avatar;
    activated;
    username;
    phone;
    status;
    last_seen;
    bio;
    device_id;
    is_verified;
    public_key;
    private_key;
    gender;
    dob;

    constructor(model) {
        this.email = model.email;
        this.id = model.id; 
        this.avatar = model.avatar;
        this.activated = model.activated;
        this.username = model.username;
        this.phone = model.phone;
        this.status = model.status;
        this.last_seen = model.last_seen;
        this.public_key = model.public_key;
        this.private_key = model.private_key;
        this.bio = model.bio;
        this.device_id = model.device_id;
        this.is_verified = model.is_verified;
        this.gender = model.gender;
        this.dob = model.dob;
    }
} 