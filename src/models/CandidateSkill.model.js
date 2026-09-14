const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CandidateSkill = sequelize.define(
  "CandidateSkill",
  {
    candidateId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: "candidates",
        key: "id"
      }
    },

    skillId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: "skills",
        key: "id"
      }
    }
  },
  {
    tableName: "candidate_skills",
    timestamps: false
  }
);

module.exports = CandidateSkill;