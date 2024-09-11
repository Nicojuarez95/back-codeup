import mongoose from "mongoose";

let schema = new mongoose.Schema({
    name: {type: String, required: true},
    mail: {type: String, required: true},
    password: {type: String, required: true},
    password_repeat: {type: String, required: true}
},{
    timestramps: true
})

let User = mongoose.model('users',schema)

export default User