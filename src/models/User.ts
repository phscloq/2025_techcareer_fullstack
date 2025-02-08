import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "No username provided"],
        trim: true,
        minlength: [3, "Minimum 3 characters required for username"],
        maxlength: [20, "Maximum 20 characters allowed for username"],
    },
    email: {
        type: String,
        required: [true, "No email provided"],
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    password: {
        type: String,
        required: [true, "No password provided"],
        minlength: [6, "Minimum 6 characters required for password"],
    },

    // DATE
    dateInformation: {
        type: Date, default: Date.now(),
    },
},
{
        
        timestamps: true,
    });

const User = mongoose.model("User", UserSchema);
export default User;