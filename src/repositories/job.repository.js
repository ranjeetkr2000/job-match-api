const { Job, Skill } = require("../models");
const sequelize = require("../config/database");

async function createJob(data, transaction) {
  return Job.create(data, { transaction });
}

async function findById(id, transaction) {
  return Job.findByPk(id, {
    transaction,
    include: {
      model: Skill,
      as: "skills",
      attributes: ["id", "name"],
      through: { attributes: ["type"] }
    }
  });
}

async function findEligibleJobs(candidateId, limit = 20, offset = 0) {
  return Job.findAll({
    limit,
    offset,

    attributes: ["id", "title", "location"],

    where: sequelize.literal(`
      NOT EXISTS (
        SELECT 1
        FROM job_skills js
        WHERE js."jobId" = "Job"."id"
          AND js.type = 'MUST_HAVE'
          AND NOT EXISTS (
            SELECT 1
            FROM candidate_skills cs
            WHERE cs."candidateId" = :candidateId
              AND cs."skillId" = js."skillId"
          )
      )
    `),
    replacements: { candidateId }, 

    include: {
      model: Skill,
      as: "skills",
      attributes: ["id", "name"],
      through: { attributes: ["type"] }
    }
  });
}

module.exports = {
  createJob,
  findById,
  findEligibleJobs
};