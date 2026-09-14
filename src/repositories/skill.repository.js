const { Skill } = require("../models");

async function findOrCreate(name, transaction) {
  const [skill] = await Skill.findOrCreate({
    where: {
      name
    },
    transaction
  });

  return skill;
}

module.exports = {
  findOrCreate
};