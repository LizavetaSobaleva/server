const {Schema, model, ObjectId} = require("mongoose")


const User = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    diskSpace: {type: Number, default: 1024**3},
    usedSpace: {type: Number, default: 0},
    avatar: {type: String},
    files : [{type: ObjectId, ref:'File'}],
    status: { type: String, default: 'standard' } // статусы: standard, premium, admin
})

module.exports = model('User', User)
