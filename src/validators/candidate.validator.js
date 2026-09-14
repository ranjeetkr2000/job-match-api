const { z } = require("zod");

const createCandidateSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),

  skills: z
    .array(z.string().trim().min(1))
    .min(1, "At least one skill is required"),

  yearsOfExperience: z
    .number()
    .min(0, "Years of experience cannot be negative"),

  location: z.string().trim().min(1, "Location is required"),

  expectedSalary: z
    .number()
    .min(0, "Expected salary cannot be negative")
});

module.exports = {
  createCandidateSchema
};