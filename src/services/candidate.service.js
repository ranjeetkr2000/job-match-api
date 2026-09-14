const sequelize = require("../config/database");

const {
  CandidateSkill
} = require("../models");

const candidateRepository = require("../repositories/candidate.repository");
const skillRepository = require("../repositories/skill.repository");

async function createCandidate(data) {
  return sequelize.transaction(async (transaction) => {
    const candidate = await candidateRepository.createCandidate(
      {
        name: data.name,
        yearsOfExperience: data.yearsOfExperience,
        location: data.location,
        expectedSalary: data.expectedSalary
      },
      transaction
    );

    const skillNames = [
      ...new Set(
        data.skills.map((skill) =>
          skill.toLowerCase()
        )
      )
    ];

    for (const skillName of skillNames) {
      const skill = await skillRepository.findOrCreate(
        skillName,
        transaction
      );

      await CandidateSkill.create(
        {
          candidateId: candidate.id,
          skillId: skill.id
        },
        { transaction }
      );
    }

    return candidateRepository.findById(
      candidate.id,
      transaction
    );
  });
}

module.exports = {
  createCandidate
};