const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const JobSkill = sequelize.define(
  "JobSkill",
  {
    jobId: {
      type: DataTypes.UUID,
      primaryKey: true
    },

    skillId: {
      type: DataTypes.UUID,
      primaryKey: true
    },

    type: {
      type: DataTypes.ENUM("MUST_HAVE", "NICE_TO_HAVE"),
      allowNull: false
    }
  },
  {
    tableName: "job_skills",
    timestamps: false
  }
);

module.exports = JobSkill;