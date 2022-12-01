const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Please provide a name'],
        minlength: 3,
        maxlength: 20,
        trim: true

    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email'],
        unique: true
    },
    password : {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 3,
        trim: true

    }
})

UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createToken = function() {
    return jwt.sign({userId: this._id, name: this.name}, 
        process.env.JWT_SECRET, 
        {expiresIn: process.env.JWT_LIFETIME})
}

UserSchema.methods.checkPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)