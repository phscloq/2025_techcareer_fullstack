"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
