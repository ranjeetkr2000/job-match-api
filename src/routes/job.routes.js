const express = require("express");

const {
  createJob
} = require("../controllers/job.controller");

const router = express.Router();

router.post("/", createJob);

module.exports = router;