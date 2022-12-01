const {StatusCodes} = require('http-status-codes')
const Job = require('../models/Job')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs, count: jobs.length})
}

const getJob = async (req, res) => {
    const {user: {userId}, params: {id:jobId}} = req

    const job = await Job.findOne({
        _id: jobId,
        createdBy: userId
    })
    if(!job) {
        throw new NotFoundError(`Job ${req.params.id} not found`)
    }
    res.status(StatusCodes.OK).json(job)
}

const createJob = async (req, res) => {
    const job = await Job.create({...req.body, createdBy : req.user.userId})
    res.status(StatusCodes.CREATED).json(job)
}
const updateJob = async (req, res) => {
    const {user: {userId}, params: {id:jobId}} = req
    const {company, position} = req.body

    if(!company || !position) {
        throw new BadRequestError('Missing required fields')
    }

    const job = await Job.findOneAndUpdate({
        _id: jobId,
        createdBy: userId,
    }, req.body, {new:true, runValidators: true})

    if(!job) {
        throw new NotFoundError(`Job ${req.params.id} not found`)
    }
    
    res.status(StatusCodes.OK).json(job)
}
const deleteJob = async (req, res) => {
    await Job.deleteOne({_id: req.params.id})
    res.status(StatusCodes.OK).json({success: true})
}
module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}