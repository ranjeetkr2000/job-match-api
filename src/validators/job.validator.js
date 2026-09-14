const { z } = require("zod");

const requiredSkillSchema = z.object({
  skill: z.string().trim().min(1),

  type: z.enum(["MUST_HAVE", "NICE_TO_HAVE"])
});

const createJobSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),

  requiredSkills: z
    .array(requiredSkillSchema)
    .min(1, "At least one skill is required"),

  minYearsExperience: z
    .number()
    .min(0, "Minimum experience cannot be negative"),

  location: z.string().trim().min(1, "Location is required"),

  salaryRange: z
    .object({
      min: z.number().min(0),
      max: z.number().min(0)
    })
    .refine(
      (range) => range.min <= range.max,
      {
        message: "Salary minimum cannot exceed salary maximum"
      }
    ),

  remoteAllowed: z.boolean()
}).superRefine((job, ctx) => {
  const skillNames = job.requiredSkills.map((skill) =>
    skill.skill.trim().toLowerCase()
  );

  if (new Set(skillNames).size !== skillNames.length) {
    ctx.addIssue({
      code: "custom",
      path: ["requiredSkills"],
      message: "Duplicate skills are not allowed"
    });
  }
});

module.exports = {
  createJobSchema
};