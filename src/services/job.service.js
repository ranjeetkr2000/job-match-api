const sequelize = require("../config/database");

const {
  JobSkill
} = require("../models");

const jobRepository = require("../repositories/job.repository");
const skillRepository = require("../repositories/skill.repository");

async function createJob(data) {
  return sequelize.transaction(async (transaction) => {
    const job = await jobRepository.createJob(
      {
        title: data.title,
        minYearsExperience: data.minYearsExperience,
        location: data.location,
        salaryMin: data.salaryRange.min,
        salaryMax: data.salaryRange.max,
        remoteAllowed: data.remoteAllowed
      },
      transaction
    );

    for (const requiredSkill of data.requiredSkills) {
      const skill = await skillRepository.findOrCreate(
        requiredSkill.skill.toLowerCase(),
        transaction
      );

      await JobSkill.create(
        {
          jobId: job.id,
          skillId: skill.id,
          type: requiredSkill.type
        },
        { transaction }
      );
    }

    return jobRepository.findById(
      job.id,
      transaction
    );
  });
}

module.exports = {
  createJob
};