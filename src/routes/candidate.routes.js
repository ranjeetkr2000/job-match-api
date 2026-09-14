const express = require("express");

const {
  createCandidate
} = require("../controllers/candidate.controller");

const router = express.Router();

router.post("/", createCandidate);

module.exports = router;