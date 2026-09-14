const express = require("express");

const {
  createJob
} = require("../controllers/job.controller");

const validate = require("../middleware/validate.middleware");

const {
  createJobSchema
} = require("../validators/job.validator");

const router = express.Router();

router.post(
  "/",
  validate(createJobSchema),
  createJob
);

module.exports = router;