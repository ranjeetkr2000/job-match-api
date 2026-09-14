const candidateService = require("../services/candidate.service");

async function createCandidate(req, res, next) {
  try {
    const candidate =
      await candidateService.createCandidate(req.body);

    res.status(201).json(candidate);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCandidate
};