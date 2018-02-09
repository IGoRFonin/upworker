const mongoose = require('mongoose');
const sendMail = require('../mailer').sendMail;
const jobSchema = mongoose.Schema({
    id: String,
    title: String,
    link: String,
    location: String,
    spent: String,
    skills: Array,
    paidInfo: String
});

const Job = mongoose.model('Jobs', jobSchema);
const saveJob = async job => {
    const isJobInited = await Job.findOne({ id: job.id }).exec();
    if (isJobInited) {
        return Promise.resolve();
    }

    const newJob = new Job(job);
    const addedJob = await newJob.save();
    sendMail(job);
    return Promise.resolve();
};

module.exports.addJobs = async jobs => {
    console.log('jobs start saves');
    await Promise.all(jobs.map(saveJob));
    console.log('jobs save ends');

    return;
}