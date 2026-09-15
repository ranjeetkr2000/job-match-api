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

async function findEligibleJobs(candidate, limit = 20, offset = 0) {
  // Destructure candidate traits to inject into PostgreSQL replacements
  const { 
    id: candidateId, 
    yearsOfExperience, 
    location, 
    expectedSalary 
  } = candidate;

  // 1. SKILL SCORE (Base 35 + prorated 15 for NICE_TO_HAVE)
  const skillScoreQuery = `
    (35.0 + COALESCE(
      (
        SELECT CASE
          WHEN COUNT(js2."skillId") = 0 THEN 15.0
          ELSE (COUNT(cs2."skillId")::float / COUNT(js2."skillId")::float) * 15.0
        END
        FROM job_skills js2
        LEFT JOIN candidate_skills cs2
          ON js2."skillId" = cs2."skillId" AND cs2."candidateId" = :candidateId
        WHERE js2."jobId" = "Job"."id" AND js2.type = 'NICE_TO_HAVE'
      ), 15.0
    ))
  `;

  // 2. EXPERIENCE SCORE
  const expScoreQuery = `
    CASE
      WHEN "Job"."minYearsExperience" <= 0 THEN 20.0
      WHEN :yearsOfExperience >= "Job"."minYearsExperience" THEN 20.0
      ELSE (:yearsOfExperience / "Job"."minYearsExperience") * 20.0
    END
  `;

  // 3. LOCATION SCORE
  const locScoreQuery = `
    CASE
      WHEN LOWER("Job"."location") = LOWER(:location) THEN 15.0
      WHEN "Job"."remoteAllowed" = true THEN 10.0
      ELSE 0.0
    END
  `;

  // 4. SALARY SCORE
  const salScoreQuery = `
    CASE
      WHEN :expectedSalary <= "Job"."salaryMax" THEN 15.0
      ELSE GREATEST(0.0, 15.0 * ("Job"."salaryMax" / :expectedSalary))
    END
  `;

  // 5. TOTAL SCORE
  const totalScoreQuery = `
    (${skillScoreQuery} + ${expScoreQuery} + ${locScoreQuery} + ${salScoreQuery})
  `;

  return Job.findAll({
    limit,
    offset,
    
    // Select standard attributes plus the computed scores
    attributes: [
      "id", "title", "location",
      [sequelize.literal(skillScoreQuery), 'skillScore'],
      [sequelize.literal(expScoreQuery), 'experienceScore'],
      [sequelize.literal(locScoreQuery), 'locationScore'],
      [sequelize.literal(salScoreQuery), 'salaryScore'],
      [sequelize.literal(totalScoreQuery), 'totalScore']
    ],

    // Keep the existing hard-filter for MUST_HAVE skills
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
    
    replacements: { 
      candidateId, 
      yearsOfExperience, 
      location, 
      expectedSalary 
    }, 
    
    // Sort entirely within PostgreSQL
    order: [
      [sequelize.literal('"totalScore"'), 'DESC']
    ],

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