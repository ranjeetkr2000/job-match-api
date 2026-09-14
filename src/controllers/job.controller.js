const jobService = require("../services/job.service");

async function createJob(req, res, next) {
  try {
    const job = await jobService.createJob(req.body);

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createJob
};