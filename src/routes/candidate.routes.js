const express = require("express");

const {
  createCandidate
} = require("../controllers/candidate.controller");

const validate = require("../middleware/validate.middleware");

const {
  createCandidateSchema
} = require("../validators/candidate.validator");

const router = express.Router();

router.post(
  "/",
  validate(createCandidateSchema),
  createCandidate
);

module.exports = router;