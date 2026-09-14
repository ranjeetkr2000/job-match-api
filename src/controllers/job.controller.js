const {
  Job,
  Skill,
  JobSkill
} = require("../models");

const createJob = async (req, res) => {
  try {
    const {
      title,
      requiredSkills,
      minYearsExperience,
      location,
      salaryRange,
      remoteAllowed
    } = req.body;

    if (
      !title ||
      !Array.isArray(requiredSkills) ||
      requiredSkills.length === 0 ||
      minYearsExperience === undefined ||
      !location ||
      !salaryRange ||
      salaryRange.min === undefined ||
      salaryRange.max === undefined ||
      remoteAllowed === undefined
    ) {
      return res.status(400).json({
        message: "Invalid job data"
      });
    }

    if (Number(salaryRange.min) > Number(salaryRange.max)) {
      return res.status(400).json({
        message: "salaryRange.min must be less than or equal to salaryRange.max"
      });
    }

    if (typeof remoteAllowed !== "boolean") {
      return res.status(400).json({
        message: "remoteAllowed must be a boolean"
      });
    }

    const normalizedSkills = requiredSkills.map((item) => ({
      name: item.skill?.trim().toLowerCase(),
      type: item.type?.trim().toUpperCase()
    }));

    const hasInvalidSkill = normalizedSkills.some(
      (skill) =>
        !skill.name ||
        !["MUST_HAVE", "NICE_TO_HAVE"].includes(skill.type)
    );

    if (hasInvalidSkill) {
      return res.status(400).json({
        message:
          "Each required skill must have a skill name and type of MUST_HAVE or NICE_TO_HAVE"
      });
    }

    const duplicateSkills = new Set(
      normalizedSkills.map((skill) => skill.name)
    );

    if (duplicateSkills.size !== normalizedSkills.length) {
      return res.status(400).json({
        message: "Duplicate skills are not allowed"
      });
    }

    const job = await Job.create({
      title,
      minYearsExperience,
      location,
      salaryMin: salaryRange.min,
      salaryMax: salaryRange.max,
      remoteAllowed
    });

    const skillRecords = [];

    for (const skill of normalizedSkills) {
      const [skillRecord] = await Skill.findOrCreate({
        where: {
          name: skill.name
        }
      });

      skillRecords.push({
        skillRecord,
        type: skill.type
      });
    }

    await JobSkill.bulkCreate(
      skillRecords.map(({ skillRecord, type }) => ({
        jobId: job.id,
        skillId: skillRecord.id,
        type
      }))
    );

    const result = await Job.findByPk(job.id, {
      include: {
        model: Skill,
        as: "skills",
        attributes: ["id", "name"],
        through: {
          attributes: ["type"]
        }
      }
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create job error:", error);

    return res.status(500).json({
      message: "Failed to create job"
    });
  }
};

module.exports = {
  createJob
};