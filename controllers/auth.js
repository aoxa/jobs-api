const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')

const register = async (req, res) => {
    const user = await User.create({...req.body})
    res.status(StatusCodes.CREATED).json({user: {name: user.name}, token: user.createToken()})
}

const login = async (req, res) => {
    const {email, password} = req.body
    if(!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({email})

    if(!user) {
        throw new UnauthenticatedError('Invalid credentials')
    }

    const isValid = await user.checkPassword(password)

    if(!isValid) {
        throw new UnauthenticatedError('Invalid credentials')
    }

    const token = user.createToken()
    res.status(StatusCodes.OK).json({user: {name: user.name}, token})
}

module.exports = {
    register,
    login
}