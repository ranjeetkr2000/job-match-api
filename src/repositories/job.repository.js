const {
  Job,
  Skill
} = require("../models");

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
      through: {
        attributes: ["type"]
      }
    }
  });
}

async function findAll() {
  return Job.findAll({
    include: {
      model: Skill,
      as: "skills",
      attributes: ["id", "name"],
      through: {
        attributes: ["type"]
      }
    }
  });
}

module.exports = {
  createJob,
  findById,
  findAll
};