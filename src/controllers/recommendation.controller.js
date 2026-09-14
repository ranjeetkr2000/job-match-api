const recommendationService = require("../services/recommendation.service");

async function getRecommendations(req, res, next) {
  try {
    const recommendations =
      await recommendationService.getRecommendations(
        req.params.candidateId,
        req.query.limit
      );

    res.status(200).json({
      candidateId: req.params.candidateId,
      recommendations
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRecommendations
};