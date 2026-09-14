const {
  Candidate,
  Skill
} = require("../models");

async function createCandidate(data, transaction) {
  return Candidate.create(data, { transaction });
}

async function findById(id, transaction) {
  return Candidate.findByPk(id, {
    transaction,
    include: {
      model: Skill,
      as: "skills",
      attributes: ["id", "name"],
      through: {
        attributes: []
      }
    }
  });
}

module.exports = {
  createCandidate,
  findById
};