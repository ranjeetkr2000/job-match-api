const express = require("express");

const {
  createCandidate
} = require("../controllers/candidate.controller");

const {
  getRecommendations
} = require("../controllers/recommendation.controller");

const validate = require("../middleware/validate.middleware");

const {
  createCandidateSchema
} = require("../validators/candidate.validator");

const {
  recommendationParamsSchema,
  recommendationQuerySchema
} = require("../validators/recommendation.validator");

const router = express.Router();

router.post(
  "/",
  validate(createCandidateSchema),
  createCandidate
);

router.get(
  "/:candidateId/recommendations",
  validate(recommendationParamsSchema, "params"),
  validate(recommendationQuerySchema, "query"),
  getRecommendations
);

module.exports = router;